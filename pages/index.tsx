import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { FullLocalStorage } from '../types/types';
import { generateKeyID } from '../utils/generateID/generateKeyID';
import { isWindow } from '../utils/isWindow';
import { setLocalStorage } from '../utils/localStorage/setLocalStorage';
import { getFullGiftsLocalStorage } from '../utils/localStorage/getFullGiftsLocalStorage';
import { generateGiftID } from '../utils/generateID/generateGiftID';
import { Button } from '~/components/Button';

const inter = Inter({ subsets: ['latin'] });


export default function Home() {
  const [giftData, setGiftData] = useState<FullLocalStorage[]>([]);
  useEffect(() => {
    isWindow(); // checks if Window is not undefined, else throws an error

    console.log('effect');
    const fullLocalStorage = getFullGiftsLocalStorage();
    setGiftData(fullLocalStorage);
  }, []);

  function handleSubmit() {
    const giftName: string = (
      document.getElementById('giftName') as HTMLInputElement
    ).value;
    const receiverName: string = (
      document.getElementById('giftReceiver') as HTMLInputElement
    ).value;

    if (typeof giftName !== 'string' || giftName.length === 0)
      throw new Error("Invalid gift's name!");
    if (typeof receiverName !== 'string' || receiverName.length === 0)
      throw new Error("Invalid receiver's name!");

    const JSON_Object: { name: string; gift: string; keyID: string } = {
      name: receiverName,
      gift: giftName,
      keyID: generateKeyID(),
    };

    setLocalStorage(generateGiftID(), JSON.stringify(JSON_Object));
    setGiftData((previousValue) => previousValue.concat(JSON_Object));
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div id="fullScreenContainer" className="justify-center grid h-5">
        <div id="formContainer" className="mt-5">
          <form id="giftForm" className="" action={'/api/create'}>
            <div id="formTitle" className="text-2xl pt-4">
              Lahjalistaidea
            </div>

            <div id="giftNameContainer" className="pt-4 grid">
              <label htmlFor="giftName">Lahja</label>
              <input
                id="giftName"
                autoComplete='off'
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Kortti"
                name="giftName"
              />
            </div>
            <div id="giftReceiverContainer" className="pt-4 grid">
              <label htmlFor="receiver">Saaja</label>
              <input
                autoComplete='off'
                id="giftReceiver"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Aku Ankka"
                name="receiver"
              />
            </div>
            <Button
            id='submitButton'
            handleSubmit={handleSubmit} 
            >
              Lisää
            </Button>
          </form>
        </div>
        <div id="receiverListContainer" className="mt-3">
          <div id="receiverTitle" className="text-2xl pt-4">
            Lahjaideat
          </div>
          <div id="giftData">
            {giftData.map(giftData => (
              <p key={giftData.keyID}>
                {giftData.name} - {giftData.gift}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


