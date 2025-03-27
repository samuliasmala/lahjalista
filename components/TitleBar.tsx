import React, { Dispatch, SetStateAction, HTMLAttributes } from 'react';
import SvgUser from '~/icons/user';
import { QueryKeys, User } from '~/shared/types';
import axios from 'axios';
import { Button } from './Button';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import Link from 'next/link';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { handleErrorToast } from '~/utils/handleToasts';
import { handleError } from '~/utils/handleError';
import SvgSpinner from '~/icons/spinner';
import { errorWrapper } from '~/utils/utilFunctions';

type UserDetails = Pick<User, 'firstName' | 'lastName' | 'email' | 'role'>;

type TitleBar = {
  setShowUserWindow: Dispatch<SetStateAction<boolean>>;
  showUserWindow: boolean;
  userDetails: User;
};

export function TitleBar({
  setShowUserWindow,
  showUserWindow,
  userDetails,
}: TitleBar) {
  const router = useRouter();

  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-full flex-row justify-between bg-primaryLight p-3 pr-2 sm:w-96 sm:pr-0">
        <div
          className="select-none text-lg hover:cursor-pointer"
          onClick={errorWrapper(() => {
            router.push('/').catch((e) => console.log(e));
          })}
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
          user={userDetails}
          closeUserWindow={() => setShowUserWindow(false)}
        />
      </div>
    </div>
  );
}

function UserDetailModal({
  user,
  showUserWindow,
  closeUserWindow,
}: HTMLAttributes<HTMLDivElement> & {
  user: User;
  showUserWindow: boolean;
  closeUserWindow: () => void;
}) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { isPending, error, mutateAsync } = useMutation({
    mutationKey: QueryKeys.LOGOUT,
    mutationFn: async () => await axios.post('/api/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
      router.push('/logout').catch((e) => console.error(e));
    },
  });

  useShowErrorToast(error);

  if (user && showUserWindow) {
    return (
      <>
        <div
          className={`fixed left-0 top-0 h-full w-full max-w-full bg-transparent ${isPending ? 'z-[100]' : ''}`}
          onClick={() => {
            // this blocks the closing of the User Modal if request for logout is sent
            if (!isPending) {
              closeUserWindow();
            }
          }}
        />
        <div className="absolute right-1 top-12 z-[99] w-56 rounded-md border-2 border-lines bg-bgForms shadow-md shadow-black">
          <p className="overflow mb-0 ml-3 mt-3 font-bold [overflow-wrap:anywhere]">
            {user.firstName} {user.lastName}
          </p>
          <p className="ml-3 [overflow-wrap:anywhere]">{user.email}</p>
          <div className="flex w-full flex-col justify-center">
            <AdminPanelButton userDetails={user} />
            <Button
              className="mb-4 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-primary text-sm font-medium"
              onClick={async () => {
                try {
                  await mutateAsync();
                } catch (e) {
                  handleErrorToast(handleError(e));
                }
              }}
              disabled={isPending}
            >
              {' '}
              Kirjaudu ulos
              {isPending ? (
                <SvgSpinner
                  width={18}
                  height={18}
                  className="ml-2 animate-spin"
                />
              ) : (
                <SvgArrowRightStartOnRectangle
                  width={18}
                  height={18}
                  className="ml-2"
                />
              )}
            </Button>
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
    <Button className="relative mb-0 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-black">
      <Link href={'/admin'} className="absolute h-full w-full" />
      <p className={`text-sm font-medium text-white`}>Ylläpito</p>
      <SvgUser width={18} height={18} className="ml-2" />
    </Button>
  );
}
