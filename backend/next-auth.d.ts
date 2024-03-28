import { DefaultSession } from 'next-auth';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
    };
  }
}
