import { HTMLAttributes, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { User } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import SvgUser from '~/icons/user';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import { getServerSideProps } from '~/utils/getServerSideProps';
import { jost } from '~/utils/fonts';
import { TitleText } from '~/components/TitleText';
import { TitleBar } from '~/components/Titlebar';
import Image from 'next/image';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isAnyKindOfError, setIsAnyKindOfError] = useState(false);
  const [isAnyKindOfErrorMessage, setIsAnyKindOfErrorMessage] = useState('');
  const [showUserWindow, setShowUserWindow] = useState(false);

  useEffect(() => {
    try {
      console.log('effect');
    } catch (e) {
      handleError(e);
    }
  }, []);

  function handleError(e: unknown) {
    const errorMessage = handleGeneralError(e);
    setIsAnyKindOfError(true);
    setIsAnyKindOfErrorMessage(errorMessage);
  }

  return (
    <main className="h-screen w-full max-w-full">
      <TitleBar
        setShowUserWindow={setShowUserWindow}
        showUserWindow={showUserWindow}
        user={user}
      />
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center justify-center sm:max-w-96">
          <TitleText className="ml-7 mt-3 self-start font-normal">
            Profiili
          </TitleText>
          <div className="flex flex-row justify-center gap-4 self-start">
            <Image
              src={'/images/person.png'}
              alt="person smiling"
              width={150}
              height={150}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p>John Doe</p>
              <p>john.doe@email.com</p>
              <div className="flex">
                <p>@</p>
                <p>Location</p>
              </div>
              <div className="flex">
                <p>#</p>
                <p>31.7.2024</p>
              </div>
            </div>
          </div>

          {isAnyKindOfError && (
            <div className="fixed bottom-0 left-0 z-[98] flex w-full items-center justify-center">
              <div className="z-[99] w-full bg-red-600 p-10 text-center" />
              <span className="fixed z-[99] animate-bounce text-5xl">
                {isAnyKindOfErrorMessage}
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
