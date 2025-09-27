import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(credentials!.password, user.password);

        if (!passwordMatch) {
          throw new Error('Invalid credentials');
        }

        // ✅ Only allow admin login
        if (user.role !== 'admin') {
          throw new Error('Access denied');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
};
