import { FormEvent, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, getAllGifts } from '~/utils/apiRequests';
import { Gift, CreateGift, User } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from 'next';
import { validateRequest } from '~/backend/auth';
import axios from 'axios';
import { useRouter } from 'next/router';
import SvgUser from '~/icons/user';
import { Modal } from '~/components/Modal';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User }>> {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  return {
    props: {
      user: JSON.parse(JSON.stringify(cookieData.user)),
    },
  };
}

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

  const router = useRouter();

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
    <main className="bg-white w-full max-w-full h-screen">
      <div className="justify-center flex">
        <div className="bg-gray-300 sm:pr-0 pr-2 p-3 flex flex-row justify-between sm:w-72 w-full relative">
          <div className="text-lg select-none">Lahjaidealista</div>
          <SvgUser
            width={32}
            height={32}
            className="cursor-pointer hover:stroke-yellow-600"
            onClick={() => setShowUserWindow((prevValue) => !prevValue)}
          />
          {user && showUserWindow ? (
            <div className=" z-[99] bg-white absolute top-12 right-1 w-52 h-auto shadow-md shadow-black outline outline-2">
              <div>
                <div>
                  <p className="pl-3 pt-3 pb-0 font-bold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="pl-3">{user.email}</p>
                  <div className="pt-2 pl-3 pr-3 pb-4">
                    <div className="bg-black flex items-center h-9 hover:cursor-pointer group/logout">
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
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="justify-center grid">
        <div className="mt-5 pl-8 pr-8">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <TitleText className="select-none">Uusi idea</TitleText>
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
            <div className="pt-4 grid">
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
            <Button type="submit">Lisää</Button>
          </form>
        </div>
        <div className="pl-8 pr-8 mt-3 w-full max-w-xl">
          <TitleText>Lahjaideat</TitleText>
          <div>
            {giftData.map((giftItem) => (
              <div
                key={`${giftItem.uuid}_divbutton`}
                className="animate-opacity"
              >
                <li
                  key={giftItem.uuid}
                  className="[overflow-wrap:anywhere] hover-target"
                >
                  {giftItem.receiver} - {giftItem.gift}
                </li>
                <Button
                  key={`${giftItem.uuid}_deletebutton`}
                  className="m-3 p-0 w-16 h-8 hover:text-red-600 pointer-events-auto trigger-line-through"
                  onClick={() => {
                    setDeleteModalGiftData(giftItem);
                    setIsDeleteModalOpen(true);
                  }}
                  type="button"
                >
                  Poista
                </Button>
                <Button
                  key={`${giftItem.uuid}_editbutton`}
                  className="m-3 ml-0 p-0 w-20 h-8 hover:text-yellow-400 trigger-underline"
                  onClick={() => {
                    setEditModalGiftData(giftItem);
                    setIsEditModalOpen(true);
                  }}
                  type="button"
                >
                  Muokkaa
                </Button>
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

            <Button
              onClick={async () => {
                const request = await axios.post('/api/auth/logout');
                if (request) router.push('/login');
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
