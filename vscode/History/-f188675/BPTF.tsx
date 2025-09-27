import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ChildrenProps } from '@/types';
import { getServerSession } from 'next-auth';

export default async function layout({ children }: ChildrenProps) {
  const session = await getServerSession(authOptions);
  return <div>layout</div>;
}
