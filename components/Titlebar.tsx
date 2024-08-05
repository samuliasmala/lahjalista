import { Dispatch, SetStateAction } from 'react';
import SvgUser from '~/icons/user';
import { User } from '~/shared/types';
import axios from 'axios';
import { HTMLAttributes } from 'react';
import { Button } from './Button';
import { jost } from '~/utils/fonts';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';

type TitleBar = {
  setShowUserWindow: Dispatch<SetStateAction<boolean>>;
  showUserWindow: boolean;
  user: User;
};

export function TitleBar({
  setShowUserWindow,
  showUserWindow,
  user,
}: TitleBar) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-full flex-row justify-between bg-primaryLight p-3 pr-2 sm:w-96 sm:pr-0">
        <div className="select-none text-lg">Lahjaidealista</div>
        <SvgUser
          width={24}
          height={24}
          className={`z-[98] mr-4 cursor-pointer`}
          onClick={() => setShowUserWindow((prevValue) => !prevValue)}
        />
        <UserDetailModal
          showUserWindow={showUserWindow}
          user={user}
          closeUserWindow={() => setShowUserWindow(false)}
        />
      </div>
    </div>
  );
}

export function UserDetailModal({
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
          <div className="flex w-full flex-col justify-center">
            <Button
              className="mb-0 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-primary"
              onClick={() => {
                try {
                  window.location.href = '/profile';
                } catch (e) {
                  console.error(e);
                  window.location.href = '/';
                }
              }}
            >
              <p className={`text-white ${jost.className} text-sm font-medium`}>
                Profiili
              </p>
              <SvgUser
                width={18}
                height={18}
                className="ml-2"
                strokeClassName="stroke-white"
              />
            </Button>
            {/* Kannattaisiko olla Button Divin sijaan, koska on klikattava elementti? CHECK THIS*/}
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
