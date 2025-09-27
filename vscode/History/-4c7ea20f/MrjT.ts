'use server';

import { currentUser } from '@clerk/nextjs/server';
import { error } from 'console';

export async function streamTokenProvider(params: type) {
  const user = await currentUser();
  if (!user) throw new error('User not authencated');
}
