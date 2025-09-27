import { IUser } from '@/types/user';
import prisma from '../prisma';

export async function createUser(userData: IUser) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userData.clerkUserId },
  });

  if (user) return user;

  const newUser = await prisma.user.create({
    data: userData,
  });

  try {
  } catch (error) {
    throw error;
  }
}
