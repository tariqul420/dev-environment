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
    const updatedUser = await prisma.user.update({
      where: { clerkUserId },
      data: user,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// delete an existing user
export async function deleteUser(clerkUserId: string) {
  try {
    const result = await prisma.user.delete({
      where: { clerkUserId },
    });

    return result;
  } catch (error) {
    throw error;
  }
}
