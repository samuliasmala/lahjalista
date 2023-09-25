import { Inter } from 'next/font/google';
import { ReactNode, useEffect, useState } from 'react';
import { FullLocalStorage } from '../types/types';
import { generateKeyID } from '../utils/generateID/generateKeyID';
import { isWindow } from '../utils/isWindow';
import { setLocalStorage } from '../utils/localStorage/setLocalStorage';
import { getFullGiftsLocalStorage } from '../utils/localStorage/getFullGiftsLocalStorage';
import { generateGiftID } from '../utils/generateID/generateGiftID';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { TitleText } from '~/components/TitleText';
import { SmallContainer } from '~/components/SmallContainer';
import { Form } from '~/components/Form';
import { Label } from '../components/Label';
import { Input } from '../components/Input';

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

    const JSON_Object: { name: string; gift: string; id: string } = {
      name: receiverName,
      gift: giftName,
      id: generateKeyID(),
    };

    setLocalStorage(generateGiftID(), JSON.stringify(JSON_Object));
    setGiftData((previousValue) => previousValue.concat(JSON_Object));
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div id="fullScreenContainer" className="justify-center grid h-5">
        <div id="formContainer" className="mt-5">
          <Form id="giftForm" action="/api/create">
            <TitleText id='formTitle' className='text-2xl pt-4'>Lahjalistaidea</TitleText>
            <Container id='giftNameContainer' className='pt-4 grid'>
              <Label htmlFor='giftName'>Lahja</Label>
              <Input
              id='giftName'
              autoComplete='off'
              type='text'
              className='ps-1 pt-3 pb-3 border hover:bg-gray-100'
              placeholder="Kortti"
              name='giftName'
              />
            </Container>
            <div id="giftReceiverContainer" className="pt-4 grid">
              <label htmlFor="receiver">Saaja</label>
              <input
                autoComplete="off"
                id="giftReceiver"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Aku Ankka"
                name="receiver"
              />
            </div>
            <Button id="submitButton" handleSubmit={handleSubmit}>
              Lisää
            </Button>
          </Form>
        </div>
        <Container id="receiverListContainer" className="mt-3">
          <TitleText id="receiverTitle" className="text-2xl pt-4">
            Lahjaideat
          </TitleText>
          <SmallContainer id='giftData'>
              {giftData.map(gift => (
                <li key={gift.id}>
                  {gift.name} - {gift.gift}
                </li>
              ))}
          </SmallContainer>
        </Container>
      </div>
    </main>
  );
}


