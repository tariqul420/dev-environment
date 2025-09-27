import prisma from '../prisma';

// get all interviews
export async function getInterviews() {
  try {
    const interviews = await prisma.interview.findMany();
    return interviews;
  } catch (error) {
    throw error;
  }
}

// get my interviews
