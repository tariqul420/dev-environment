'use server';

import User from '@/models/user.model';

interface LoginProps {
  email: string;
  password: string;
}
export async function getLogin({ email, password }: LoginProps) {
  try {
    const dbPass = await User.findOne({ email });
  } catch (error) {
    throw error;
  }
}
