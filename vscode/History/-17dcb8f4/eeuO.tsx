import { LoginForm } from '@/components/auth/login-form';

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center py-6 md:py-20">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
