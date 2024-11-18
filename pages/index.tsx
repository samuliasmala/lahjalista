import React, { FormEvent, HTMLAttributes, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, getAllGifts } from '~/utils/apiRequests';
import { Gift, CreateGift, User } from '~/shared/types';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import SvgUser from '~/icons/user';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import { getServerSideProps } from '~/utils/getServerSideProps';
import SvgPencilEdit from '~/icons/pencil_edit';
import SvgTrashCan from '~/icons/trash_can';
import axios from 'axios';
import { handleErrorToast } from '~/utils/handleToasts';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [giftData, setGiftData] = useState<Gift[]>([]);
  const [giftNameError, setGiftNameError] = useState(false);
  const [receiverError, setReceiverError] = useState(false);
  const [newReceiver, setNewReceiver] = useState('');
  const [newGiftName, setNewGiftName] = useState('');

  const [showUserWindow, setShowUserWindow] = useState(false);

  const giftQuery = useQuery({
    queryKey: ['loadingGifts'],
    queryFn: async () => await fetchGifts(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  async function fetchGifts() {
    try {
      const gifts = await getAllGifts();
      setGiftData(gifts);
      return gifts;
    } catch (e) {
      handleErrorToast(handleError(e));
      throw new Error('Palvelinvirhe! Lisätietoja kehittäjäkonsolissa');
    }
  }

  async function handleSubmit(e: FormEvent<HTMLElement>) {
    try {
      e.preventDefault();
      setGiftNameError(false);
      setReceiverError(false);
      // this variable is used for checking both inputs
      // could use return statement instead of errorFound, but it would not give an error message to all invalid inputs. Only the first invalid input.
      let errorFound = false;

      if (typeof newGiftName !== 'string' || newGiftName.length === 0) {
        setGiftNameError(true);
        errorFound = true;
      }
      if (typeof newReceiver !== 'string' || newReceiver.length === 0) {
        setReceiverError(true);
        errorFound = true;
      }
      if (errorFound) {
        return;
      }

      const newGift: CreateGift = {
        receiver: newReceiver,
        gift: newGiftName,
      };

      const createdGift = await createGift(newGift);
      const updatedGiftList = giftData.concat(createdGift);
      console.log(createdGift, updatedGiftList);
      setGiftData(updatedGiftList);
      setNewGiftName('');
      setNewReceiver('');
    } catch (e) {
      handleErrorToast(handleError(e));
    }
  }

  async function refreshGiftList() {
    try {
      const gifts = await getAllGifts();
      console.log(gifts);
      setGiftData(gifts);
    } catch (e) {
      if (
        handleError(e) !==
        'Istuntosi on vanhentunut! Ole hyvä ja kirjaudu uudelleen jatkaaksesi!'
      ) {
        handleErrorToast(handleError(e));
      }
    }
  }

  return (
    <main className="h-screen w-full max-w-full">
      <div className="flex justify-center">
        <div className="relative flex w-full flex-row justify-between bg-primaryLight p-3 pr-2 sm:w-96 sm:pr-0">
          <div className="select-none text-lg">Lahjaidealista</div>
          <SvgUser
            width={24}
            height={24}
            className={`z-[98] mr-4 cursor-pointer text-stone-600`}
            onClick={() => setShowUserWindow((prevValue) => !prevValue)}
          />
          <UserDetailModal
            showUserWindow={showUserWindow}
            user={user}
            closeUserWindow={() => setShowUserWindow(false)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-72">
          <div className="mt-12">
            <form onSubmit={(e) => void handleSubmit(e)}>
              <TitleText className="select-none text-start">
                Uusi idea
              </TitleText>
              <div className="mt-6 flex flex-col">
                <label htmlFor="giftName" className="select-none">
                  Lahja
                </label>
                <Input
                  onChange={(event) => setNewGiftName(event.target.value)}
                  autoComplete="off"
                  type="text"
                  placeholder="Kortti"
                  name="giftName"
                  value={newGiftName}
                />
                {giftNameError && (
                  <div className="text-red-500">Lahja on pakollinen</div>
                )}
              </div>
              <div className="mt-4 flex flex-col">
                <label htmlFor="receiver" className="select-none">
                  Saaja
                </label>
                <Input
                  onChange={(event) => setNewReceiver(event.target.value)}
                  autoComplete="off"
                  type="text"
                  placeholder="Matti Meikäläinen"
                  name="receiver"
                  value={newReceiver}
                />
                {receiverError && (
                  <div className="text-red-500">Lahjansaaja on pakollinen</div>
                )}
              </div>
              <Button
                type="submit"
                className={`mt-8 ${giftQuery.isFetching || giftQuery.isError ? 'cursor-not-allowed bg-red-500' : null}`}
                disabled={
                  giftQuery.isFetching || giftQuery.isError ? true : false
                }
              >
                Lisää
              </Button>
            </form>
          </div>
          <TitleText className="mt-7 text-start text-xl">Lahjaideat</TitleText>
          <GiftList
            giftQuery={giftQuery}
            giftData={giftData}
            refreshGiftList={() => void refreshGiftList()}
          />
        </div>
      </div>
    </main>
  );
}

function GiftList({
  giftQuery,
  giftData,
  refreshGiftList,
}: {
  giftQuery: UseQueryResult<Gift[], Error>;
  giftData: Gift[];
  refreshGiftList: () => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalGiftData, setDeleteModalGiftData] = useState<Gift>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalGiftData, setEditModalGiftData] = useState<Gift>();
  const { isPending, isFetching, error } = giftQuery;

  if (isPending || isFetching)
    return (
      <p className="loading-dots mt-4 text-lg font-bold">Noudetaan lahjoja</p>
    );

  if (error) return <p className="mt-5 bg-red-500 text-lg">{error.message}</p>;

  return (
    <div>
      {giftData.length > 0 && (
        <div>
          {giftData.map((giftItem) => (
            <div
              key={`${giftItem.uuid}_divbutton`}
              className="mt-4 animate-opacity"
            >
              <div key={giftItem.uuid} className="grid">
                <p
                  className={`hover-target col-start-1 text-primaryText [overflow-wrap:anywhere]`}
                >
                  {giftItem.gift} <span>-</span> {giftItem.receiver}
                </p>
                <SvgPencilEdit
                  key={`${giftItem.uuid}_editbutton`}
                  width={24}
                  height={24}
                  className="trigger-underline col-start-2 row-start-1 mr-8 justify-self-end align-middle text-stone-600 hover:cursor-pointer"
                  onClick={() => {
                    setEditModalGiftData(giftItem);
                    setIsEditModalOpen(true);
                  }}
                />

                <SvgTrashCan
                  key={`${giftItem.uuid}_deletebutton`}
                  width={24}
                  height={24}
                  className="trigger-line-through col-start-2 row-start-1 justify-self-end align-middle text-stone-600 hover:cursor-pointer"
                  onClick={() => {
                    setDeleteModalGiftData(giftItem);
                    setIsDeleteModalOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
          {isEditModalOpen && editModalGiftData && (
            <EditModal
              gift={editModalGiftData}
              refreshGiftList={() => void refreshGiftList()}
              setIsModalOpen={setIsEditModalOpen}
            />
          )}

          {isDeleteModalOpen && deleteModalGiftData && (
            <DeleteModal
              gift={deleteModalGiftData}
              refreshGiftList={() => void refreshGiftList()}
              setIsModalOpen={setIsDeleteModalOpen}
            />
          )}
        </div>
      )}
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
  async function handleLogout() {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/logout';
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
          <div className="flex w-full justify-center">
            <Button
              className="mb-4 ml-3 mr-3 mt-4 flex h-8 w-full max-w-56 items-center justify-center rounded-md bg-primary"
              onClick={() => void handleLogout()}
            >
              <p className={`text-sm font-medium text-white`}>Kirjaudu ulos</p>
              <SvgArrowRightStartOnRectangle
                width={18}
                height={18}
                className="ml-2"
              />
            </Button>
          </div>
        </div>
      </>
    );
  }
  return null;
}
