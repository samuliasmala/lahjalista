import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { FullLocalStorage } from '../types/types';
import { generateUUID } from '../utils/generateID/generateUUID';
import { isWindow } from '../utils/isWindow';
import { setLocalStorage } from '../utils/localStorage/setLocalStorage';
import { getFullGiftsLocalStorage } from '../utils/localStorage/getFullGiftsLocalStorage';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { TitleText } from '~/components/TitleText';
import { SmallContainer } from '~/components/SmallContainer';
import { Form } from '~/components/Form';
import { Label } from '../components/Label';
import { Input } from '../components/Input';
import { Main } from '~/components/Main';
import { generateLocalStorageID } from '~/utils/generateID/generateLocalStorageID';

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

    const generatedUUID = generateUUID()
    const localStorageKeyID = generateLocalStorageID("gift", generatedUUID)
    const JSON_Object: {
      name: string;
      gift: string;
      id: string;
      localStorageKeyID: string;
    } = {
      name: receiverName,
      gift: giftName,
      id: generatedUUID,
      localStorageKeyID: localStorageKeyID,
    };

    setLocalStorage(localStorageKeyID, JSON.stringify(JSON_Object));
    setGiftData((previousValue) => previousValue.concat(JSON_Object));
  }

  function handleDeletion(event: React.MouseEvent<HTMLElement>) {
    const parentElementID = event.currentTarget.parentElement?.id;
    console.log(parentElementID);
    console.log(window.localStorage.getItem(`gift_${parentElementID}`));
  }

  return (
    <Main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <Container id="fullScreenContainer" className="justify-center grid h-5">
        <Container id="formContainer" className="mt-5">
          <Form id="giftForm" action="/api/create">
            <TitleText id="formTitle" className="text-2xl pt-4">
              Lahjalistaidea
            </TitleText>
            <Container id="giftNameContainer" className="pt-4 grid">
              <Label htmlFor="giftName">Lahja</Label>
              <Input
                id="giftName"
                autoComplete="off"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Kortti"
                name="giftName"
              />
            </Container>
            <Container id="giftReceiverContainer" className="pt-4 grid">
              <Label htmlFor="receiver">Saaja</Label>
              <Input
                autoComplete="off"
                id="giftReceiver"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Aku Ankka"
                name="receiver"
              />
            </Container>
            <Button
              id="submitButton"
              handleClick={handleSubmit}
              className="w-full text-s mt-6 p-2 text-white border bg-black hover:text-gray-500 "
            >
              Lisää
            </Button>
          </Form>
        </Container>
        <Container id="receiverListContainer" className="mt-3">
          <TitleText id="receiverTitle" className="text-2xl pt-4">
            Lahjaideat
          </TitleText>
          <SmallContainer id="giftData">
            {giftData.map((giftItem) => (
              <div key={`${giftItem.id}_divbutton`}>
                <li key={giftItem.id} id={giftItem.id}>
                  {giftItem.name} - {giftItem.gift}{' '}
                  
                  <Button
                    key={`${giftItem.id}_deletebutton`}
                    id="deletionButton"
                    onMouseOver={() => {
                      let idOfElementToHide = giftItem.id as string;
                      const element =
                        document.getElementById(idOfElementToHide);
                      if (!element) return;
                      element.className = 'line-through';
                    }}
                    onMouseOut={() => {
                      let idOfElementToHide = giftItem.id as string;
                      const element =
                        document.getElementById(idOfElementToHide);
                      if (!element) return;
                      element.className = '';
                    }}
                    className="border bg-black text-white ms-5 w-16 h-8 hover:text-red-600 "
                    handleClick={(event: React.MouseEvent<HTMLElement>) =>
                      handleDeletion(event)
                    }
                  >
                    Poista
                  </Button>
                </li>
              </div>
            ))}
          </SmallContainer>
        </Container>
      </Container>
    </Main>
  );
}


