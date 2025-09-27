'use server';

import User from '@/models/user.model';
import bcrypt from 'bcrypt';

interface LoginProps {
  email: string;
  password: string;
}
export async function getLogin({ email, password }: LoginProps) {
  try {
    const user = await User.findOne({ email });
    const dbPass = user.password;
    bcrypt.compare(password, dbPass);
  } catch (error) {
    throw error;
  }
}
