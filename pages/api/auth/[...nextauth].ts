import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import prisma from '~/prisma';
import { compare as bcryptCompare } from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';
import { randomBytes } from 'crypto';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ account }) {
      console.log('account!!!!!', account);
      if (account) return true;
      return false;
    },
    async jwt(jwtData) {
      if (jwtData.account) {
        console.log('jwtData:', jwtData);
      }
      return jwtData;
    },
    async session(sessionData) {
      console.log('sessionData: \n\n\n\n', sessionData.token);
      console.log(sessionData.session.user);
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
        try {
          //console.log('credentials: \n\n\n\n', credentials);
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

          isEmailValid(credentialsEmail);

          const user = await prisma.user.findUnique({
            where: {
              email: credentialsEmail,
            },
          });
          if (!user) return null;

          const isPasswordSame: boolean = await verifyPassword(
            credentialsPassword,
            user.password,
          );
          if (!isPasswordSame) return null;

          console.log('credentials!!!!!!!!!!!!11\n\n', credentials);

          return { id: user.uuid };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomBytes(32).toString('hex');
    },
  },
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

async function verifyPassword(
  givenPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcryptCompare(givenPassword, hashedPassword);
  return isMatch;
}

export default NextAuth(authOptions);
