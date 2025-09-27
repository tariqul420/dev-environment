import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LoginForm } from '@/components/auth/login-form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === 'admin') {
    return redirect('/admin');
  }

  return (
    <div className="flex w-full items-center justify-center py-6 md:py-20">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
