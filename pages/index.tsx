import { FormEvent, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '~/components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, useGetGifts } from '~/utils/apiRequests';
import { Gift, CreateGift, QueryKeys } from '~/shared/types';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import SvgPencilEdit from '~/icons/pencil_edit';
import SvgTrashCan from '~/icons/trash_can';
import { handleErrorToast } from '~/utils/handleToasts';
import { TitleBar } from '~/components/TitleBar';
import { Spinner } from '~/components/Spinner';
import { useQueryClient, useMutation } from '@tanstack/react-query';

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
      <TitleBar
        setShowUserWindow={setShowUserWindow}
        showUserWindow={showUserWindow}
        userDetails={user}
      />
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
                {createGiftQuery.isPending ? <Spinner /> : null}
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
        Noudetaan lahjoja <Spinner />
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
