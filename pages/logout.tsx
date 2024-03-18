// pages/logout.tsx

import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  const { data: session } = useSession();
  useEffect(() => {
    async function logOut() {
      await signOut({ callbackUrl: '/login' });
    }
    logOut();
  }, []);

  if (session) {
    return (
      <main
        className={`bg-white w-full max-w-full h-screen ${inter.className}`}
      >
        Logged in: {session.user?.email}
      </main>
    );
  }
  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      Not logged in
    </main>
  );
}
