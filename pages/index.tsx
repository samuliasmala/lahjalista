import { Inter } from 'next/font/google';
import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const inter = Inter({ subsets: ['latin'] });

function setLocalStorage(key: string, values: string) {
  isWindow();
  localStorage.setItem(key, values);
}

/**
 *
 * @returns a string that contains individual ID for key in React component.
 */
function generateKeyID(): string {
  isWindow();
  return crypto.randomUUID();
}

function getFullLocalStorage() {
  isWindow()
  
  let array: any = [];
  for (let [key, values] of Object.entries(localStorage)) {
    if (key.startsWith('gift_')) {
      values = JSON.parse(values);
      array = array.concat({
        name: values['name'],
        gift: values['gift'],
        keyID: values['keyID'],
      });
    }
  }
  return array;
}

/**
 *
 * @returns an individual ID with randomUUID. The individual ID looks like: gift_number-array*
 *
 * number-array* = crypto.randomUUID()
 *
 * return example: gift_150cd819-1502-4717-9c96-f7ca7b42d8bd
 */
function generateID(): string {
  isWindow();
  return `gift_${crypto.randomUUID()}`;
}

/**
 *
 * @returns if Window is undefined, throws an error
 */

function isWindow() {
  if (typeof window === 'undefined')
    throw new Error(
      'Window was defined as undefined. LocalStorage could not be read.',
    );
  return true;
}

type FullLocalStorage = {
  name?: string;
  gift?: string;
  keyID?: string;
};

export default function Home() {
  const [giftData, setGiftData] = useState<FullLocalStorage[]>([]);
  useEffect(() => {
    isWindow(); // checks if Window is not undefined, else throws an error

    console.log('effect');
    const fullLocalStorage = getFullLocalStorage();
    setGiftData((previousValue) => previousValue.concat(fullLocalStorage));
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

    setLocalStorage(generateID(), JSON.stringify(JSON_Object));
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
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Kortti"
                name="giftName"
              />
            </div>
            <div id="giftReceiverContainer" className="pt-4 grid">
              <label htmlFor="receiver">Saaja</label>
              <input
                id="giftReceiver"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Aku Ankka"
                name="receiver"
              />
            </div>
            <button
              className="w-full text-s mt-6 p-2 text-white border bg-black hover:text-gray-500"
              type="button"
              onClick={handleSubmit}
            >
              Lisää
            </button>
          </form>
        </div>
        <div id="receiverListContainer" className="mt-3">
          <div id="receiverTitle" className="text-2xl pt-4">
            Lahjaideat
          </div>
          <div id="giftData">
            {giftData.map((value) => (
              <p key={value.keyID}>
                {value.name} - {value.gift}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
