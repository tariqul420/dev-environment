import { auth } from "@clerk/nextjs/server";

export type Role = "ADMIN" | "STAFF" | "USER" | undefined;

export const userRole = async (): Promise<Role> => {
  try {
    const { sessionClaims } = await auth();
    return sessionClaims?.role as Role;
  } catch {
    return undefined;
  }
};

export const userId = async (): Promise<string | null> => {
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
};

export const requireAdmin = async () => {
  const role = await userRole();
  if (role !== "ADMIN") throw new Error("Admin access required");
  return true;
};

export const requireStaff = async () => {
  const role = await userRole();
  if (role !== "STAFF") throw new Error("Staff access required");
  return true;
};

export const requiredUser = async () => {
  const role = await userRole();
  if (role === "USER") throw new Error("User access required");
  return true;
};

export const requiredAdminOrStaff = async () => {
  const role = await userRole();
  if (role !== "ADMIN" && role !== "STAFF")
    throw new Error("Admin or Staff access required");
  return true;
};
