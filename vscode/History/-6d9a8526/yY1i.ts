"use server";

import { IUser } from "@/types/user";
import dbConnect from "../db-connect";

import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import logger from "../logger";

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

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Initialize query object
    const query = {
      role: { $ne: "admin" },
      ...(search && {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
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
                $cond: [{ $eq: ["$orders.status", "delivered"] }, 1, 0],
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
