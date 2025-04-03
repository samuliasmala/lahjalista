import { FormEvent, HTMLAttributes, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, useGetGifts } from '~/utils/apiRequests';
import { Gift, CreateGift, User, QueryKeys } from '~/shared/types';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import SvgUser from '~/icons/user';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import { getServerSideProps } from '~/utils/getServerSideProps';
import SvgPencilEdit from '~/icons/pencil_edit';
import SvgTrashCan from '~/icons/trash_can';
import axios from 'axios';
import { handleErrorToast } from '~/utils/handleToasts';
import { useRouter } from 'next/router';
import SvgSpinner from '~/icons/spinner';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [giftNameError, setGiftNameError] = useState(false);
  const [receiverError, setReceiverError] = useState(false);
  const [newReceiver, setNewReceiver] = useState('');
  const [newGiftName, setNewGiftName] = useState('');

  const [showUserWindow, setShowUserWindow] = useState(false);

  const createGiftQuery = useMutation({
    mutationKey: QueryKeys.CREATE_GIFT,
    mutationFn: async (newGift: CreateGift) => await createGift(newGift),
    // if success: refresh giftlist
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.GIFTS,
      }),
  });

  const queryClient = useQueryClient();

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
      // send gift creation request
      await createGiftQuery.mutateAsync(newGift);

      setNewGiftName('');
      setNewReceiver('');
    } catch (e) {
      handleErrorToast(handleError(e));
    }
  }

  return (
    <main className="h-screen w-full max-w-full">
      <div className="flex justify-center">
        <div className="bg-primary-light relative flex w-full flex-row justify-between p-3 pr-2 sm:w-96 sm:pr-0">
          <div className="text-lg select-none">Lahjaidealista</div>
          <SvgUser
            width={24}
            height={24}
            className={`z-98 mr-4 cursor-pointer text-stone-600`}
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
              <TitleText className="text-start select-none">
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
                className="mt-8"
                disabled={createGiftQuery.isPending}
              >
                Lisää
                {createGiftQuery.isPending ? (
                  <span className="absolute p-1">
                    <SvgSpinner
                      width={18}
                      height={18}
                      className="animate-spin text-black"
                    />
                  </span>
                ) : null}
              </Button>
            </form>
          </div>
          <TitleText className="mt-7 text-start text-xl">Lahjaideat</TitleText>
          <GiftList />
        </div>
      </div>
    </main>
  );
}

function GiftList() {
  const [deleteModalGiftData, setDeleteModalGiftData] = useState<
    Gift | undefined
  >();
  const [editModalGiftData, setEditModalGiftData] = useState<
    Gift | undefined
  >();

  const { error, isFetching, data: giftData } = useGetGifts();

  if (isFetching)
    return (
      <p className="mt-4 text-lg font-bold">
        Noudetaan lahjoja{' '}
        <span className="absolute mt-1.5 ml-2">
          <SvgSpinner width={18} height={18} className="animate-spin" />
        </span>
      </p>
    );

  if (error) return <p className="mt-5 bg-red-500 text-lg">{error.message}</p>;

  return (
    <div>
      {giftData && giftData.length > 0 && (
        <div>
          {giftData.map((giftItem) => (
            <div
              key={`${giftItem.uuid}_divbutton`}
              className="animate-opacity mt-4"
            >
              <div key={giftItem.uuid} className="grid">
                <p
                  className={`hover-target text-primary-text col-start-1 [overflow-wrap:anywhere]`}
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
                  }}
                />

                <SvgTrashCan
                  key={`${giftItem.uuid}_deletebutton`}
                  width={24}
                  height={24}
                  className="trigger-line-through col-start-2 row-start-1 justify-self-end align-middle text-stone-600 hover:cursor-pointer"
                  onClick={() => {
                    setDeleteModalGiftData(giftItem);
                  }}
                />
              </div>
            </div>
          ))}
          {editModalGiftData && (
            <EditModal
              gift={editModalGiftData}
              closeModal={() => setEditModalGiftData(undefined)}
            />
          )}

          {deleteModalGiftData && (
            <DeleteModal
              gift={deleteModalGiftData}
              closeModal={() => setDeleteModalGiftData(undefined)}
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
          className={`fixed top-0 left-0 h-full w-full max-w-full bg-transparent ${isPending ? 'z-100' : ''}`}
          onClick={() => {
            // this blocks the closing of the User Modal if request for logout is sent
            if (!isPending) {
              closeUserWindow();
            }
          }}
        />
        <div className="border-lines bg-bg-forms absolute top-12 right-1 z-99 w-56 rounded-md border-2 shadow-md shadow-black">
          <p className="overflow mt-3 mb-0 ml-3 font-bold [overflow-wrap:anywhere]">
            {user.firstName} {user.lastName}
          </p>
          <p className="ml-3 [overflow-wrap:anywhere]">{user.email}</p>
          <div className="flex w-full justify-center">
            <Button
              className="bg-primary mt-4 mr-3 mb-4 ml-3 flex h-8 w-full max-w-56 items-center justify-center rounded-md text-sm font-medium"
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
