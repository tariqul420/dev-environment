'use server';

import User from '@/models/user.model';

interface LoginProps {
  email: string;
  password: string;
}
export async function getLogin({ email, password }: LoginProps) {
  try {
    const user = await User.findOne({ email });
    const dbPass = user.password;
    bcript;
  } catch (error) {
    throw error;
  }
}
