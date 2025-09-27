import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const g = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma() {
  if (!g.prisma) {
    g.prisma = new PrismaClient().$extends(withAccelerate());
  }
  return g.prisma;
}