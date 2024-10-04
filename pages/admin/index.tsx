import React, { FormEvent, HTMLAttributes, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '~/components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, getAllGifts } from '~/utils/apiRequests';
import { Gift, CreateGift, User } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import SvgUser from '~/icons/user';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import { getServerSideProps } from '~/utils/getServerSideProps';
import SvgPencilEdit from '~/icons/pencil_edit';
import SvgTrashCan from '~/icons/trash_can';
import axios from 'axios';
import { handleErrorToast } from '~/utils/handleToasts';
import { TitleBar } from '~/components/TitleBar';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [giftData, setGiftData] = useState<Gift[]>([]);
  const [giftNameError, setGiftNameError] = useState(false);
  const [receiverError, setReceiverError] = useState(false);
  const [newReceiver, setNewReceiver] = useState('');
  const [newGiftName, setNewGiftName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalGiftData, setDeleteModalGiftData] = useState<Gift>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalGiftData, setEditModalGiftData] = useState<Gift>();
  const [showUserWindow, setShowUserWindow] = useState(false);

  useEffect(() => {
    console.log('effect');
    async function fetchGifts() {
      try {
        const gifts = await getAllGifts();
        setGiftData(gifts);
      } catch (e) {
        handleError(e);
      }
    }
    void fetchGifts();
  }, []);

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

      setGiftData(updatedGiftList);
      setNewGiftName('');
      setNewReceiver('');
    } catch (e) {
      handleError(e);
    }
  }

  async function refreshGiftList() {
    try {
      setGiftData(await getAllGifts());
    } catch (e) {
      handleError(e);
    }
  }

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
              <Button type="submit" className="mt-8">
                Lisää
              </Button>
            </form>
          </div>
          {giftData.length > 0 && (
            <div className="mt-7">
              <TitleText className="text-start text-xl">Lahjaideat</TitleText>
              {giftData.map((giftItem) => (
                <div
                  key={`${giftItem.uuid}_divbutton`}
                  className="mt-4 animate-opacity"
                >
                  <div key={giftItem.uuid} className="grid">
                    <p
                      className={`[overflow-wrap: anywhere] hover-target col-start-1 text-primaryText`}
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
      </div>
    </main>
  );
}
