'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

export async function streamTokenProvider(params: type) {
  const user = await currentUser();
  if (!user) throw new Error('User not authenticated');

  const streamClient = new StreamClient({});
}
