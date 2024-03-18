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

        // this checks that values are valid. Will be checked by Zod in the future
        // TLDR: email and password has to be a string and is atleast 1 letter long. Values cannot be undefined
        if (
          (typeof credentialsEmail === 'string' &&
            credentialsEmail.length <= 0 &&
            typeof credentialsPassword === 'string' &&
            credentialsPassword.length <= 0) ||
          credentialsEmail === undefined ||
          credentialsPassword === undefined
        ) {
          return null;
        }

        return null;
      },
    }),
  ],
};

function isEmailValid(emailAddress: string): boolean {
  const checkedEmailAddress = emailAddress
    .toLowerCase()
    .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

  if (checkedEmailAddress === null) {
    throw new Error('Invalid email!');
  }

  // email is ready to be used
  return true;
}

export default NextAuth(authOptions);
