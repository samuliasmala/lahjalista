import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn(data) {
      console.log(data, 'This is printed out!');
      return false;
    },
    async jwt({ token, account }) {
      console.log(token, account);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session(sessionData) {
      console.log('sessionData: \n\n', sessionData);
      return sessionData.session;
    },
  },
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
