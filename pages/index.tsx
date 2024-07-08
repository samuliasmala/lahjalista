import { FormEvent, HTMLAttributes, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, getAllGifts } from '~/utils/apiRequests';
import { Gift, CreateGift, User } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import SvgUser from '~/icons/user';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import { getServerSideProps } from '~/utils/getServerSideProps';
import SvgPencilEdit from '~/icons/pencil_edit';
import SvgTrashCan from '~/icons/trash_can';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isAnyKindOfError, setIsAnyKindOfError] = useState(false);
  const [isAnyKindOfErrorMessage, setIsAnyKindOfErrorMessage] = useState('');
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
    setIsAnyKindOfError(true);
    setIsAnyKindOfErrorMessage(errorMessage);
  }

  return (
    <main className="w-full max-w-full h-screen">
      <div className="justify-center flex">
        <div className="bg-primaryLight sm:pr-0 pr-2 p-3 flex flex-row justify-between sm:w-96 w-full relative">
          <div className="text-lg select-none">Lahjaidealista</div>
          <SvgUser
            width={24}
            height={24}
            className={`cursor-pointer hover:stroke-yellow-600 ${showUserWindow ? 'stroke-yellow-600' : ''} mr-4 z-[98]`}
            onClick={() => setShowUserWindow((prevValue) => !prevValue)}
          />
          <UserDetailModal
            showUserWindow={showUserWindow}
            user={user}
            closeUserWindow={() => setShowUserWindow(false)}
          />
        </div>
      </div>
      <div className="justify-center grid">
        <div className="mt-5 pl-8 pr-8">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <TitleText className="select-none text-start">Uusi idea</TitleText>
            <div className="pt-6 grid">
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
            <div className="pt-4 grid">
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
          <div className="pl-8 pr-8 pt-7 sm:max-w-96">
            <TitleText className="text-start">Lahjaideat</TitleText>
            {giftData.map((giftItem) => (
              <div
                key={`${giftItem.uuid}_divbutton`}
                className="animate-opacity pt-4 "
              >
                <div key={giftItem.uuid} className="grid">
                  <p className="col-start-1 [overflow-wrap: anywhere] hover-target">
                    {giftItem.gift} <span className="font-bold">––</span>{' '}
                    {giftItem.receiver}
                  </p>
                  <SvgPencilEdit
                    key={`${giftItem.uuid}_editbutton`}
                    width={24}
                    height={24}
                    className="col-start-2 row-start-1 mr-8 align-middle hover:cursor-pointer trigger-underline justify-self-end"
                    onClick={() => {
                      setEditModalGiftData(giftItem);
                      setIsEditModalOpen(true);
                    }}
                  />

                  <SvgTrashCan
                    key={`${giftItem.uuid}_deletebutton`}
                    width={24}
                    height={24}
                    className="col-start-2 row-start-1 align-middle hover:cursor-pointer trigger-line-through justify-self-end"
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

            {isAnyKindOfError && (
              <>
                <div className="fixed flex z-[98] justify-center items-center left-0 bottom-0 w-full">
                  <div className="bg-red-600 text-center p-10 z-[99] w-full" />
                  <span className="animate-bounce fixed z-[99] text-5xl">
                    {isAnyKindOfErrorMessage}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
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
      const request = await axios.post('/api/auth/logout');
      if (request) {
        window.location.href = '/login';
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
          className="fixed top-0 left-0 max-w-full w-full h-full bg-transparent"
          onClick={() => closeUserWindow()}
        />
        <div className=" z-[99] bg-white absolute top-12 right-1 w-52 h-auto shadow-md shadow-black outline outline-2">
          <p className="pl-3 pt-3 pb-0 font-bold overflow [overflow-wrap:anywhere]">
            {user.firstName} {user.lastName}
          </p>
          <p className="pl-3 [overflow-wrap:anywhere]">{user.email}</p>
          <div className="pt-2 pl-3 pr-3 pb-4">
            <div
              className="bg-emerald-500 rounded-md flex items-center h-9 hover:cursor-pointer group/logout"
              onClick={() => void handleLogout()}
            >
              <p className="group-hover/logout:text-gray-500 text-white ml-3">
                Kirjaudu ulos
              </p>
              <SvgArrowRightStartOnRectangle
                width={28}
                height={28}
                className="group-hover/logout:stroke-gray-500 stroke-white ml-3"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  return null;
}
