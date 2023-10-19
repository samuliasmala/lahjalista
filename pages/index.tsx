import { Inter } from 'next/font/google';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { TitleText } from '~/components/TitleText';
import {
  getLocalStorage,
  setLocalStorage,
} from '~/utils/localStorageFunctions';
import { sortGiftsOldestFirst } from '~/utils/sortGiftsOldestFirst';
import { Input } from '../components/Input';
import { Modal } from '~/components/Modal';

const inter = Inter({ subsets: ['latin'] });

export type FullLocalStorage = {
  name: string;
  gift: string;
  id?: string;
  localStorageKeyID?: string;
  createdDate: number;
};

export default function Home() {
  const [giftData, setGiftData] = useState<FullLocalStorage[]>([]);
  const [giftNameError, setGiftNameError] = useState<boolean>(false);
  const [receiverError, setReceiverError] = useState<boolean>(false);
  const [newReceiver, setNewReceiver] = useState<string>('');
  const [newGiftName, setNewGiftName] = useState<string>('');

  useEffect(() => {
    console.log('effect');
    const parsedGiftData = JSON.parse(getLocalStorage('giftData'));
    const gifts = sortGiftsOldestFirst(parsedGiftData);
    setGiftData(gifts);
  }, []);

  function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    setGiftNameError(false);
    setReceiverError(false);
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
    const jsonObject: FullLocalStorage[] = [
      {
        name: newReceiver,
        gift: newGiftName,
        id: generatedUUID,
        createdDate: new Date().getTime(),
      },
    ];
    let localStorageGiftData: FullLocalStorage[] = JSON.parse(
      getLocalStorage('giftData'),
    );
    localStorageGiftData = localStorageGiftData.concat(jsonObject);

    setLocalStorage('giftData', JSON.stringify(localStorageGiftData));
    setGiftData(localStorageGiftData);
    setNewGiftName('');
    setNewReceiver('');
  }

  function handleDeletion(gift: FullLocalStorage) {
    const confirmDeletion = confirm(`Deleting ${gift.name} - ${gift.gift}`);
    if (confirmDeletion) {
      let localStorageGifts: FullLocalStorage[] = JSON.parse(
        getLocalStorage('giftData'),
      );
      localStorageGifts = localStorageGifts.filter(
        (localStorageGift) => localStorageGift.id !== gift.id,
      );
      setLocalStorage('giftData', JSON.stringify(localStorageGifts));
      refreshGiftList();
    }
  }

  function refreshGiftList() {
    const sortedGifts = sortGiftsOldestFirst(
      JSON.parse(getLocalStorage('giftData')),
    );
    setGiftData(sortedGifts);
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <Container className="justify-center grid h-5">
        <Container className="mt-5">
          <form onSubmit={(e) => handleSubmit(e)}>
            <TitleText>Lahjalistaidea</TitleText>
            <Container className="pt-4 grid">
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
            </Container>
            <Container className="pt-4 grid">
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
            </Container>
            <Button type="submit">Lisää</Button>
          </form>
        </Container>
        <Container className="mt-3">
          <TitleText>Lahjaideat</TitleText>
          <div>
            {giftData.map((giftItem) => (
              <div
                key={`${giftItem.id}_divbutton`}
                className="animate-width whitespace-nowrap overflow-hidden"
              >
                <li key={giftItem.id}>
                  {giftItem.name} - {giftItem.gift}
                  <Modal gift={giftItem}>Poista</Modal>
                </li>
              </div>
            ))}
          </div>
        </Container>
      </Container>
    </main>
  );
}
