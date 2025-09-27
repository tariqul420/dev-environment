'use server';

import User from '@/models/user.model';
import bcrypt from 'bcrypt';

interface LoginProps {
  email: string;
  password: string;
}
export async function getVerifyLogin({ email, password }: LoginProps) {
  try {
    const user = await User.findOne({ email });
    const dbPass = user.password;
    bcrypt.compare(password, dbPass, (error, result) => {
      if (error) return false;
    });
  } catch (error) {
    throw error;
  }
}
