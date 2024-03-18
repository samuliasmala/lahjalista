import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn(data) {
      console.log('signIn data: \n\n\n\n', data);
      return false;
    },
    async jwt(jwtData) {
      console.log('jwtData: \n\n\n\n', jwtData);
      if (jwtData.account) {
        jwtData.token.accessToken = jwtData.account.access_token;
      }
      return jwtData.token;
    },
    async session(sessionData) {
      console.log('sessionData: \n\n\n\n', sessionData);
      return sessionData.session;
    },
  },
  providers: [
    CredentialProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        console.log('credentials: ', credentials);
        const credentialsEmail = credentials?.email;
        const credentialsPassword = credentials?.password;

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
