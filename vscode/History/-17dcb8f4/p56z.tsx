import { LoginForm } from '@/components/auth/login-form';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return redirect('/login');
  }

  return (
    <div className="flex w-full items-center justify-center py-6 md:py-20">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
