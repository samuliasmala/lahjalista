import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          label: 'Sähköposti',
          type: 'email',
          placeholder: 'matti.meikalainen@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '************',
        },
      },
      async authorize(credentials, req) {
        const response = await fetch(req);
        if (!response.ok) return null;
        return (await response.json()) ?? null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
