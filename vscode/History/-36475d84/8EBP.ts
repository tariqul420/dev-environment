import { IUser } from '@/types/user';
import prisma from '../prisma';

// create a new user
export async function createUser(userData: IUser) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userData.clerkUserId },
    });

    if (user) return user;

    const newUser = await prisma.user.create({
      data: userData,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
}

// update an existing user
export async function updateUser(clerkUserId: string, user: Partial<IUser>) {
  try {
    const updateUser = await prisma.user.update({
      where: { clerkUserId },
      data: user,
    });
  } catch (error) {
    throw error;
  }
}
