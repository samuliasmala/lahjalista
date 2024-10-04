import { Dispatch, SetStateAction, HTMLAttributes } from 'react';
import SvgUser from '~/icons/user';
import { User } from '~/shared/types';
import axios from 'axios';
import { Button } from './Button';
import { jost } from '~/utils/fonts';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import React from 'react';

type UserDetails = Pick<User, 'firstName' | 'lastName' | 'email' | 'role'>;

type TitleBar = {
  setShowUserWindow: Dispatch<SetStateAction<boolean>>;
  showUserWindow: boolean;
  userDetails: UserDetails;
};

export function TitleBar({
  setShowUserWindow,
  showUserWindow,
  userDetails,
}: TitleBar) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-full flex-row justify-between bg-primaryLight p-3 pr-2 sm:w-96 sm:pr-0">
        <div
          className="select-none text-lg hover:cursor-pointer"
          onClick={() => {
            try {
              window.location.href = '/';
            } catch (e) {
              window.location.href = '/';
            }
          }}
        >
          Lahjaidealista
        </div>
        <SvgUser
          width={24}
          height={24}
          className={`z-[98] mr-4 cursor-pointer text-stone-600`}
          onClick={() => setShowUserWindow((prevValue) => !prevValue)}
        />
        <UserDetailModal
          showUserWindow={showUserWindow}
          userDetails={{
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            role: userDetails.role,
          }}
          closeUserWindow={() => setShowUserWindow(false)}
        />
      </div>
    </div>
  );
}

function UserDetailModal({
  userDetails,
  showUserWindow,
  closeUserWindow,
}: HTMLAttributes<HTMLDivElement> & {
  userDetails: UserDetails;
  showUserWindow: boolean;
  closeUserWindow: () => void;
}) {
  if (userDetails && showUserWindow) {
    return (
      <>
        <div
          className="fixed left-0 top-0 h-full w-full max-w-full bg-transparent"
          onClick={() => closeUserWindow()}
        />
        <div className="absolute right-1 top-12 z-[99] w-56 rounded-md border-2 border-lines bg-bgForms shadow-md shadow-black">
          <p className="overflow mb-0 ml-3 mt-3 font-bold [overflow-wrap:anywhere]">
            {userDetails.firstName} {userDetails.lastName}
          </p>
          <p className="ml-3 [overflow-wrap:anywhere]">{userDetails.email}</p>
          <div className="flex w-full flex-col justify-center">
            <AdminPanelButton userDetails={userDetails} />
            <LogoutButton />
          </div>
        </div>
      </>
    );
  }
  return null;
}

function AdminPanelButton({ userDetails }: { userDetails: UserDetails }) {
  if (userDetails.role !== 'ADMIN') {
    return null;
  }

  return (
    <Button
      className="mb-0 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-black"
      onClick={() => {
        try {
          window.location.href = '/admin';
        } catch (e) {
          console.error(e);
          window.location.href = '/';
        }
      }}
    >
      <p className={`text-sm font-medium text-white`}>Ylläpito</p>
      <SvgUser width={18} height={18} className="ml-2" />
    </Button>
  );
}

function LogoutButton() {
  async function handleLogout() {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/logout';
    } catch (e) {
      console.error(e);
      window.location.href = '/';
    }
  }

  return (
    <Button
      className="mb-4 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md"
      onClick={() => void handleLogout()}
    >
      <p className={`text-sm font-medium text-white`}>Kirjaudu ulos</p>
      <SvgArrowRightStartOnRectangle width={18} height={18} className="ml-2" />
    </Button>
  );
}
