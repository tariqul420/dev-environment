import { IInterview, Status } from '@/types/interview';
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
    const { sessionClaims } = await auth();
    const user = await sessionClaims?.userId;

    if (!user) {
      throw new Error('User not authenticated.');
    }

    const interview = await prisma.interview.findUnique({
      where: { streamCallId },
    });

    return interview;
  } catch (error) {
    throw error;
  }
}

export async function createInterview(interviewData: IInterview) {
  try {
    const { sessionClaims } = await auth();
    const user = await sessionClaims?.userId;

    if (!user) {
      throw new Error('User not authenticated.');
    }

    const interview = await prisma.interview.create({
      data: { ...interviewData, comments: undefined },
    });

    return interview;
  } catch (error) {
    throw error;
  }
}

// update interview status
export async function updateInterviewStatus(interviewId: string, status: Status) {
  try {
    const { sessionClaims } = await auth();
    const user = await sessionClaims?.userId;

    if (!user) {
      throw new Error('User not authenticated.');
    }

    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status,
        ...(status === 'completed' && { endTime: new Date() }),
      },
    });

    return interview;
  } catch (error) {
    throw error;
  }
}
