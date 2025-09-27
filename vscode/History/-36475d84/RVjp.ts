import { IUser } from '@/types/user';
import prisma from '../prisma';

export async function createUser(userData: IUser) {
  const updatedUser = await prisma.user;
  try {
  } catch (error) {
    throw error;
  }
}
