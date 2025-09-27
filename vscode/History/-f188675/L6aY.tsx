import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ChildrenProps } from '@/types';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function layout({ children }: ChildrenProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return redirect('/login');
  }

  const role = session.user.role as string;

  return <main>{children}</main>;
}
