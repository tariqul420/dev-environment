import { auth } from '@clerk/nextjs/server';
import prisma from '../prisma';

// get all interviews
export async function getInterviews() {
  try {
    const { sessionClaims } = await auth();
    const user = await sessionClaims?.userId;

    if (!user) {
      throw new Error('User not authenticated.');
    }

    const interviews = await prisma.interview.findMany();
    return interviews;
  } catch (error) {
    throw error;
  }
}

// get my interviews
export async function getMyInterviews() {
  try {
    const { sessionClaims } = await auth();
    const user = await sessionClaims?.userId;

    if (!user) {
      throw new Error('User not authenticated.');
    }

    const interviews = await prisma.interview.findMany({
      where: { candidateId: user },
    });

    return interviews;
  } catch (error) {
    throw error;
  }
}

export async function getInterviewByStreamCallId(streamCallId: string) {
  try {
  } catch (error) {
    throw error;
  }
}
