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

/*
<div className="flex justify-center">
                <div className="relative flex w-full flex-row justify-between bg-primaryLight p-3 pr-2 sm:w-96 sm:pr-0">
                    <div className="select-none text-lg">Lahjaidealista</div>
                    <SvgUser
                        width={24}
                        height={24}
                        className={`cursor-pointer hover:stroke-yellow-600 ${showUserWindow ? 'stroke-yellow-600' : ''} z-[98] mr-4`}
                        onClick={() => setShowUserWindow((prevValue) => !prevValue)}
                    />
                    <UserDetailModal
                        showUserWindow={showUserWindow}
                        user={user}
                        closeUserWindow={() => setShowUserWindow(false)}
                    />
                </div>
            </div>
*/

/*
function UserDetailModal({
    user,
    showUserWindow,
    closeUserWindow,
}: HTMLAttributes<HTMLDivElement> & {
    user: User;
    showUserWindow: boolean;
    closeUserWindow: () => void;
}) {
    async function handleLogout() {
        try {
            const request = await axios.post('/api/auth/logout');
            if (request) {
                window.location.href = '/logout';
            }
        } catch (e) {
            console.error(e);
            window.location.href = '/';
        }
    }

    if (user && showUserWindow) {
        return (
            <>
                <div
                    className="fixed left-0 top-0 h-full w-full max-w-full bg-transparent"
                    onClick={() => closeUserWindow()}
                />
                <div className="absolute right-1 top-12 z-[99] w-56 rounded-md border-2 border-lines bg-bgForms shadow-md shadow-black">
                    <p className="overflow mb-0 ml-3 mt-3 font-bold [overflow-wrap:anywhere]">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="ml-3 [overflow-wrap:anywhere]">{user.email}</p>
                    <div className="flex flex-col w-full justify-center">
                        <Button className='mb-0 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-primary'
                            onClick={() => {
                                try {
                                    window.location.href = "/profile"
                                }
                                catch (e) {
                                    console.error(e)
                                    window.location.href = "/"
                                }
                            }}>
                            <p className={`text-white ${jost.className} text-sm font-medium`}>
                                Profiili
                            </p>
                            <SvgUser
                                width={18}
                                height={18}
                                className="ml-2"
                                strokeClassName='stroke-white'
                            />
                        </Button>
                        <Button
                            className="mb-4 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-primary"
                            onClick={() => void handleLogout()}
                        >
                            <p className={`text-white ${jost.className} text-sm font-medium`}>
                                Kirjaudu ulos
                            </p>
                            <SvgArrowRightStartOnRectangle
                                width={18}
                                height={18}
                                className="ml-2 stroke-white"
                            />
                        </Button>
                    </div>
                </div>
            </>
        );
    }
    return null;
}
*/
