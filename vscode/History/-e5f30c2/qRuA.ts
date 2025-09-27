import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [CredentialsProvider()],
};
