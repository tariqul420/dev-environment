'use server';

import { IComment } from '@/types/comment';
import prisma from '../prisma';

// create a comment
export async function addComment(commentData: IComment) {
  try {
    const comment = await prisma.comment.create({
      data: commentData,
    });

    return comment;
  } catch (error) {
    throw error;
  }
}

// get all comment for an interview
export async function getComments(interviewId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { interviewId },
    });

    return comments;
  } catch (error) {
    throw error;
  }
}
