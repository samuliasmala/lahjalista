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
import SvgLocationPin from '~/icons/location_pin';
import SvgCalendar from '~/icons/calendar';
import SvgPencilEdit from '~/icons/pencil_edit';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isAnyKindOfError, setIsAnyKindOfError] = useState(false);
  const [isAnyKindOfErrorMessage, setIsAnyKindOfErrorMessage] = useState('');
  const [showUserWindow, setShowUserWindow] = useState(false);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [currentDate, setCurrentDate] = useState('31.7.2024');

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
          <TitleText className="ml-7 mt-5 self-start font-normal text-black">
            Profiili
          </TitleText>
          <div className="mt-6 flex flex-col items-center justify-center rounded-md border border-primary bg-neutral-100">
            <Image
              src={'/images/person.png'}
              alt="person smiling"
              width={150}
              height={150}
              className="ml-14 mr-14 mt-8 rounded-full"
            />
            <div className="items-cen ml-14 mr-14 mt-7 flex flex-col gap-1">
              <p className={`text-lg font-semibold ${jost.className}`}>
                {firstName} {lastName}
              </p>
              <p className={`${jost.className} text-sm`}>{email}</p>
              <div className="flex">
                <SvgLocationPin width={20} height={20} />
                <p className={`ml-1 ${jost.className} text-sm`}>
                  Location / maybe country?
                </p>
              </div>
              <div className="flex">
                <SvgCalendar width={20} height={20} />
                <p className={`ml-1 ${jost.className} text-sm`}>31.7.2024</p>
              </div>
            </div>
            <SvgPencilEdit
              width={24}
              height={24}
              className="mb-3 mr-4 self-end"
            />
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
