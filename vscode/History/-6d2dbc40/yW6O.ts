import { IComment } from '@/types/comment';
import prisma from '../prisma';

export async function addComment(commentData: IComment) {
  try {
    const comment = await prisma.comment.create({
      data: commentData,
    });
  } catch (error) {
    throw error;
  }
}
