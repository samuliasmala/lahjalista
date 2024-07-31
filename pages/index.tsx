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
import { jost } from '~/utils/fonts';

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
    <main className="h-screen w-full max-w-full">
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
                      className={`[overflow-wrap: anywhere] hover-target col-start-1 text-primaryText ${jost.className}`}
                    >
                      {giftItem.gift}{' '}
                      <span className={`${jost.className}`}>-</span>{' '}
                      {giftItem.receiver}
                    </p>
                    <SvgPencilEdit
                      key={`${giftItem.uuid}_editbutton`}
                      width={24}
                      height={24}
                      className="trigger-underline col-start-2 row-start-1 mr-8 justify-self-end align-middle hover:cursor-pointer"
                      onClick={() => {
                        setEditModalGiftData(giftItem);
                        setIsEditModalOpen(true);
                      }}
                    />

                    <SvgTrashCan
                      key={`${giftItem.uuid}_deletebutton`}
                      width={24}
                      height={24}
                      className="trigger-line-through col-start-2 row-start-1 justify-self-end align-middle hover:cursor-pointer"
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
                  <div className="fixed bottom-0 left-0 z-[98] flex w-full items-center justify-center">
                    <div className="z-[99] w-full bg-red-600 p-10 text-center" />
                    <span className="fixed z-[99] animate-bounce text-5xl">
                      {isAnyKindOfErrorMessage}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
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
        <div className=" absolute right-1 top-12 z-[99] w-56 rounded-md border-2 border-lines bg-bgForms shadow-md shadow-black">
          <p className="overflow mb-0 ml-3 mt-3 font-bold [overflow-wrap:anywhere]">
            {user.firstName} {user.lastName}
          </p>
          <p className="ml-3 [overflow-wrap:anywhere]">{user.email}</p>
          <div className="flex flex-col w-full justify-center">
            <Button className='mb-0 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-primary hover:cursor-pointer'>
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
            {/* Kannattaisiko olla Button Divin sijaan, koska on klikattava elementti? CHECK THIS*/}
            <Button
              className="mb-4 ml-3 mr-3 mt-4 flex h-8 w-auto max-w-56 items-center justify-center rounded-md bg-primary hover:cursor-pointer"
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
