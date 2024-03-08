import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import PostgresAdapter from '@auth/pg-adapter';
import { Adapter } from 'next-auth/adapters';
import { z } from 'zod';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const loginUserSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email!',
    ),
  password: z.string().min(6, 'Password has to be at least 6 characters long!'),
});

type AuthenticationUser = {
  id: string;
  email: string;
  password: string;
};

const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool) as Adapter,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'test@test.com' },
        password: {
          label: 'Password',
          type: 'text',
          placeholder: 'SecretPassword',
        },
      },
      async authorize(credentials, req) {
        const { email, password } = loginUserSchema.parse(credentials);
        const user = await prisma?.user.findUnique({
          where: { email: email },
        });

        if (!user) return null;

        const isPasswordCorrect = await verifyPassword(password, user.password);

        if (!isPasswordCorrect) return null;
        const returnableUser: AuthenticationUser = {
          email: user.email,
          password: user.password,
          id: user.uuid,
        };
        return returnableUser;
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
};

async function loginUser() {}

async function verifyPassword(
  givenPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(givenPassword, hashedPassword);
  return isMatch;
}

export default NextAuth(authOptions);
