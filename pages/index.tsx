import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Form } from '~/components/Form';
import { Main } from '~/components/Main';
import { SmallContainer } from '~/components/SmallContainer';
import { TitleText } from '~/components/TitleText';
import { generateLocalStorageID } from '~/utils/generateID/generateLocalStorageID';
import {
  getLocalStorage,
  removeLocalStorage,
  getFullGiftsLocalStorage,
  setLocalStorage,
} from '~/utils/localStorageFunctions';
import { sortGiftsOldestFirst } from '~/utils/sortGiftsOldestFirst';
import { Input } from '../components/Input';
import { Label } from '../components/Label';

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
  const [receiverError, setReceiverError] = useState<boolean>(false);
  const [giftNameError, setGiftNameError] = useState<boolean>(false);

  useEffect(() => {
    console.log('effect');
    let parsedGiftData: [] = JSON.parse(getLocalStorage('giftData'));
    if (parsedGiftData === null) {
      parsedGiftData = [];
      setLocalStorage('giftData', JSON.stringify(parsedGiftData));
    }
    const gifts = sortGiftsOldestFirst(parsedGiftData);
    setGiftData(gifts);
  }, []);

  function handleSubmit() {
    setReceiverError(false);
    setGiftNameError(false);
    let errorFound: boolean = false;

    const giftNameInput = document.getElementById(
      'giftName',
    ) as HTMLInputElement;
    const giftReceiverInput = document.getElementById(
      'giftReceiver',
    ) as HTMLInputElement;
    const giftName: string = giftNameInput.value;
    const giftReceiver: string = giftReceiverInput.value;

    if (typeof giftName !== 'string' || giftName.length === 0) {
      setReceiverError(true);
      errorFound = true;
    }
    if (typeof giftReceiver !== 'string' || giftReceiver.length === 0) {
      setGiftNameError(true);
      errorFound = true;
    }
    if (errorFound) {
      return;
    }

    const generatedUUID = crypto.randomUUID();
    const JSON_Object: FullLocalStorage[] = [
      {
        name: giftReceiver,
        gift: giftName,
        id: generatedUUID,
        createdDate: new Date().getTime(),
      },
    ];
    let localStorageGiftData: FullLocalStorage[] = JSON.parse(
      getLocalStorage('giftData') as string,
    );
    localStorageGiftData = localStorageGiftData.concat(JSON_Object);

    setLocalStorage('giftData', JSON.stringify(localStorageGiftData));
    setGiftData(localStorageGiftData);
    giftNameInput.value = '';
    giftReceiverInput.value = '';
  }

  function handleDeletion(gift: FullLocalStorage) {
    const confirmDeletion = confirm(`Deleting ${gift.name} - ${gift.gift}`);
    if (confirmDeletion) {
      let localStorageGifts: FullLocalStorage[] = JSON.parse(getLocalStorage('giftData'));
      localStorageGifts = localStorageGifts.filter(localStorageGift => localStorageGift.id !== gift.id)
      setLocalStorage("giftData", JSON.stringify(localStorageGifts))
      refreshGiftList()
    }
  }

  function refreshGiftList() {
    const sortedGifts = sortGiftsOldestFirst(JSON.parse(getLocalStorage("giftData")));
    setGiftData(sortedGifts);
  }

  return (
    <Main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <Container className="justify-center grid h-5">
        <Container className="mt-5">
          <Form onSubmit={(e) => e.preventDefault()}>
            <TitleText className="text-2xl pt-4">Lahjalistaidea</TitleText>
            <Container className="pt-4 grid">
              <Label htmlFor="giftName">Lahja</Label>
              <Input
                id="giftName"
                required={true}
                onInvalid={(event) =>
                  (event.target as HTMLInputElement).setCustomValidity(' ')
                }
                autoComplete="off"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Kortti"
                name="giftName"
              />
              {receiverError && (
                <div className="text-red-500">Lahja on pakollinen</div>
              )}
            </Container>
            <Container className="pt-4 grid">
              <Label htmlFor="receiver">Saaja</Label>
              <Input
                id="giftReceiver"
                required={true}
                onInvalid={(event) =>
                  (event.target as HTMLInputElement).setCustomValidity(' ')
                }
                autoComplete="off"
                type="text"
                className="ps-1 pt-3 pb-3 border hover:bg-gray-100"
                placeholder="Aku Ankka"
                name="receiver"
              />
              {giftNameError && (
                <div className="text-red-500">Lahjansaaja on pakollinen</div>
              )}
            </Container>
            <Button
              onClick={handleSubmit}
              type="submit"
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
                  {giftItem.name} - {giftItem.gift}
                  <Button
                    key={`${giftItem.id}_deletebutton`}
                    id="deletionButton"
                    onMouseOver={() => {
                      const idOfElementToHide = giftItem.id as string;
                      const element =
                        document.getElementById(idOfElementToHide);
                      if (!element) return;
                      element.className = 'line-through';
                    }}
                    onMouseOut={() => {
                      const idOfElementToHide = giftItem.id as string;
                      const element =
                        document.getElementById(idOfElementToHide);
                      if (!element) return;
                      element.className = '';
                    }}
                    className="border bg-black text-white ms-5 mb-3 w-16 h-8 hover:text-red-600"
                    onClick={() => handleDeletion(giftItem)}
                    type="button"
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
