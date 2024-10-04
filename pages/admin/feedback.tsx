import React, { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { handleGeneralError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import { handleErrorToast } from '~/utils/handleToasts';
import { TitleBar } from '~/components/TitleBar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showUserWindow, setShowUserWindow] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    }
  }, []);

  function handleError(e: unknown) {
    const errorMessage = handleGeneralError(e);
    if (errorMessage === 'You are unauthorized!') {
      window.location.href = '/';
    }
    handleErrorToast(errorMessage);
  }

  return (
    <main className="h-screen w-full max-w-full">
      <TitleBar
        setShowUserWindow={setShowUserWindow}
        showUserWindow={showUserWindow}
        userDetails={user}
      />
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-72"></div>
      </div>
    </main>
  );
}
