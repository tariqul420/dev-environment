"use server";

import { IUser } from "@/types/user";
import dbConnect from "../db-connect";

import User from "@/models/user.model";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import logger from "../logger";
import { objectId } from "../utils";

// type
type AppRole = "admin" | "customer";



// create a new user
export async function createUser(userData: IUser) {
  try {
    await dbConnect();
    const user = await User.findOne({ clerkUserId: userData.clerkUserId });

    if (user) return user;

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    revalidateTag("user");
    revalidateTag("admin-users");
    return savedUser;
  } catch (error) {
    logger.error("Error creating user:", error);
    throw error;
  }
}

// update an existing user
export async function updateUser(clerkUserId: string, user: Partial<IUser>) {
  try {
    await dbConnect();
    const updatedUser = await User.findOneAndUpdate({ clerkUserId }, user, {
      new: true,
    });

    revalidateTag("user");
    revalidateTag("admin-users");
    return updatedUser;
  } catch (error) {
    logger.error("Error updating user:", error);
    throw error;
  }
}

// delete an existing user
export async function deleteUser(clerkUserId: string) {
  try {
    await dbConnect();
    const result = await User.deleteOne({ clerkUserId });

    revalidateTag("user");
    revalidateTag("admin-users");
    return result;
  } catch (error) {
    logger.error("Error deleting user:", error);
    throw error;
  }
}

// get a single user using clerk user id
export const getUser = unstable_cache(
  async (clerkUserId: string) => {
    try {
      await dbConnect();
      return await User.findOne({ clerkUserId });
    } catch (error) {
      logger.error("Error fetching user:", error);
      throw error;
    }
  },
  ["getUser"],
  { tags: ["user"] },
);

// get all user for admin
export const getUsersForAdmin = async ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    const userId = sessionClaims?.userId

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Initialize query object
    const rx = search && { $regex: search, $options: "i" };
    const query = {
      _id: { $ne: objectId(userId as string) },
      ...(search && {
        $or: [{ firstName: rx }, { lastName: rx }, { email: rx }],
      }),
    };

    // Execute aggregation
    const [users, total] = await Promise.all([
      User.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "orders",
            localField: "email",
            foreignField: "email",
            as: "orders",
          },
        },
        {
          $unwind: { path: "$orders", preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: "$_id",
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            email: { $first: "$email" },
            role: { $first: "$role" },
            profilePicture: { $first: "$profilePicture" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            totalOrderCount: {
              $sum: {
                $cond: [{ $ifNull: ["$orders", false] }, 1, 0],
              },
            },
            completedOrderCount: {
              $sum: {
                $cond: [
                  { $in: ["$orders.status", ["delivered", "confirmed"]] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]),
      User.countDocuments({
        ...(search && query),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: JSON.parse(JSON.stringify(users)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const updateUserRole = async ({
  userId,
  newRole,
  path,
}: UpdateUserRoleInput) => {
  const { sessionClaims } = await auth();
  const actorRole = (sessionClaims as Record<string, unknown> | undefined)?.role as
    | AppRole
    | undefined;

  if (actorRole !== "admin") {
    return { ok: false, error: "Forbidden: only admin can change roles" as const };
  }

  await dbConnect();

  const user = await User.findById(userId)
    .select("role clerkUserId")
    .lean<IUser | null>();

  if (!user) return { ok: false, error: "User not found" as const };

  const nextRole: AppRole =
    newRole ?? (user.role === "admin" ? "customer" : "admin");

  const updated = await User.findByIdAndUpdate(
    userId,
    { role: nextRole },
    { new: true }
  )
    .select("role clerkUserId")
    .lean<IUser | null>();

  if (!updated) return { ok: false, error: "Failed to update user role" as const };

  if (updated.clerkUserId) {
    await clerkClient.users.updateUser(updated.clerkUserId, {
      publicMetadata: {
        userId: String(updated._id),
        role: updated.role,
      },
    });
  } else {
    console.warn(
      "User has no clerkUserId; skipping Clerk metadata sync",
      userId
    );
  }

  if (path) revalidatePath(path);

  return {
    ok: true as const,
    data: { _id: String(updated._id), role: updated.role },
    message: `Role updated to ${updated.role}`,
  };
};
