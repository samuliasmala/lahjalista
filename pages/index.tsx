import { Inter } from 'next/font/google';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { createGift, getAllGifts } from '~/utils/jsonServerFunctions';

const inter = Inter({ subsets: ['latin'] });

export type Gift = {
  name: string;
  gift: string;
  id: string;
  localStorageKeyID?: string;
  createdDate: number;
};

export type isGiftDeletedAlreadyType = {
  showModal: boolean;
  giftName: string;
  giftReceiver: string;
};

export default function Home() {
  const [giftData, setGiftData] = useState<Gift[]>([]);
  const [giftNameError, setGiftNameError] = useState(false);
  const [receiverError, setReceiverError] = useState(false);
  const [newReceiver, setNewReceiver] = useState('');
  const [newGiftName, setNewGiftName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGiftData, setModalGiftData] = useState<Gift>();

  useEffect(() => {
    console.log('effect');
    async function fetchGifts() {
      const gifts = await getAllGifts();
      setGiftData(gifts);
    }
    fetchGifts().catch((e) => {
      console.error(e);
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLElement>) {
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

    const generatedUUID = crypto.randomUUID();
    const newGift: Gift = {
      name: newReceiver,
      gift: newGiftName,
      id: generatedUUID,
      createdDate: new Date().getTime(),
    };

    const currentGiftList = await getAllGifts();
    const updatedGiftList = currentGiftList.concat(newGift);

    await createGift(newGift);
    setGiftData(updatedGiftList);
    setNewGiftName('');
    setNewReceiver('');
  }

  async function refreshGiftList() {
    setGiftData(await getAllGifts());
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div className="justify-center grid h-5">
        <div className="mt-5">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <TitleText>Lahjalistaidea</TitleText>
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
            <div className="pt-4 grid">
              <label htmlFor="receiver">Saaja</label>
              <Input
                onChange={(event) => setNewReceiver(event.target.value)}
                autoComplete="off"
                type="text"
                placeholder="Aku Ankka"
                name="receiver"
                value={newReceiver}
              />
              {receiverError && (
                <div className="text-red-500">Lahjansaaja on pakollinen</div>
              )}
            </div>
            <Button type="submit">Lisää</Button>
          </form>
        </div>
        <div className="mt-3">
          <TitleText>Lahjaideat</TitleText>
          <div>
            {giftData.map((giftItem) => (
              <div
                key={`${giftItem.id}_divbutton`}
                className="animate-width whitespace-nowrap overflow-hidden"
              >
                <li
                  key={giftItem.id}
                  className="hover:line-through pointer-events-none"
                >
                  {giftItem.name} - {giftItem.gift}
                  <Button
                    key={`${giftItem.id}_deletebutton`}
                    className="ms-5 p-0 w-16 h-8 hover:text-red-600 pointer-events-auto"
                    onClick={() => {
                      setModalGiftData(giftItem);
                      setIsModalOpen(true);
                    }}
                    type="button"
                  >
                    Poista
                  </Button>
                </li>
              </div>
            ))}
            {isModalOpen && modalGiftData && (
              <DeleteModal
                gift={modalGiftData}
                giftListRefreshFunction={() => void refreshGiftList()}
                setIsModalOpen={setIsModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
