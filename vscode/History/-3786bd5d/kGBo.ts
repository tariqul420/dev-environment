import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Factory that returns the extended client
const createPrisma = () => new PrismaClient().$extends(withAccelerate());
// Infer the correct extended type
type PrismaX = ReturnType<typeof createPrisma>;

// Put it on globalThis to avoid re-instantiation in dev
const g = globalThis as unknown as { prisma?: PrismaX };

// Singleton
export const prisma: PrismaX = g.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  // Cache on global in dev only
  g.prisma = prisma;
}

// Optional helper if you prefer a function
export function getPrisma(): PrismaX {
  return prisma;
}
