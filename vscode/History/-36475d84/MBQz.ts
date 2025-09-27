import { IUser } from '@/types/user';
import prisma from '../prisma';

export async function createUser(userData: IUser) {
  const user = await prisma.user.findFirstOrThrow({
    where: { clerkUserId: userData.clerkUserId },
  });

  if (user) return user;

  try {
  } catch (error) {
    throw error;
  }
}
