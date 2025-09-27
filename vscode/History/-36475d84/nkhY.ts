import { IUser } from '@/types/user';
import prisma from '../prisma';

// create a new user
export async function createUser(userData: IUser) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userData.clerkId },
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
export async function updateUser(clerkId: string, user: Partial<IUser>) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: user,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// delete an existing user
export async function deleteUser(clerkId: string) {
  try {
    const result = await prisma.user.delete({
      where: { clerkId },
    });

    return result;
  } catch (error) {
    throw error;
  }
}
