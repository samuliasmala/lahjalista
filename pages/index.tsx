import { FormEvent, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, getAllGifts } from '~/utils/apiRequests';
import { Gift, CreateGift } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';

export default function Home() {
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
      <div className="justify-center grid">
        <div className="mt-5 pl-8 pr-8">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <TitleText>Lahjalistaidea</TitleText>
            <div className="pt-4 grid">
              <label htmlFor="receiver">Saaja</label>
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
              <label htmlFor="giftName">Lahja</label>
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
          </div>
        </div>
      </div>
    </main>
  );
}
