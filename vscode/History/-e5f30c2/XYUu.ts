import dbConnect from '@/lib/db-connect';
import UserModel from '@/models/user.model';
import bcrypt from 'bcryptjs';
import type { AuthOptions, Session, User } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await UserModel.findOne({ email: credentials?.email });
        if (!user) throw new Error('User not found');

        const passwordMatch = await bcrypt.compare(credentials!.password, user.password);
        if (!passwordMatch) throw new Error('Invalid credentials');
        if (user.role !== 'admin') throw new Error('Access denied');

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | undefined }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) session.user.role = token.role as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
