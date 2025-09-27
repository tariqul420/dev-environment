import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    throw new Error('You do not have permission to perform this action!');
  }

  return session;
}
