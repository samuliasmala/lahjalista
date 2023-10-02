import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
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
import { getLocalStorage } from '~/utils/localStorage/getLocalStorage';
import { removeLocalStorage } from '~/utils/localStorage/removeLocalStorage';
import { sortGiftsOldestFirst } from '~/utils/sortGiftsOldestFirst';

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
    const fullLocalStorage = sortGiftsOldestFirst(getFullGiftsLocalStorage());
    setGiftData(fullLocalStorage);
  }, []);

  function handleSubmit() {
    setReceiverError(false)
    setGiftNameError(false)
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

    const generatedUUID = generateUUID();
    const localStorageKeyID = generateLocalStorageID('gift', generatedUUID);
    const JSON_Object: FullLocalStorage = {
      name: giftReceiver,
      gift: giftName,
      id: generatedUUID,
      localStorageKeyID: localStorageKeyID,
      createdDate: new Date().getTime(),
    };

    setLocalStorage(localStorageKeyID, JSON.stringify(JSON_Object));
    setGiftData((previousValue) => previousValue.concat(JSON_Object));
    giftNameInput.value = '';
    giftReceiverInput.value = '';
    setReceiverError(false);
    setGiftNameError(false);
  }

  function handleDeletion(event: React.MouseEvent<HTMLElement>) {
    const parentElementID = event.currentTarget.parentElement?.id; // sets variable to have delete button's <li> element's ID

    const localStorageItem = getLocalStorage(`gift_${parentElementID}`);
    if (typeof localStorageItem !== 'string') {
      console.error('localStorageItem was not a string!');
      return;
    }
    const localStorageData: FullLocalStorage = JSON.parse(localStorageItem);

    const confirmationForDeleting = confirm(
      `Deleting ${localStorageData.name} - ${localStorageData.gift}`,
    );

    if (confirmationForDeleting) {
      removeLocalStorage(`gift_${parentElementID}`);
      refreshGiftList();
    }
  }

  function refreshGiftList() {
    const fullLocalStorage = sortGiftsOldestFirst(getFullGiftsLocalStorage());
    setGiftData(fullLocalStorage);
  }

  return (
    <Main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <Container id="fullScreenContainer" className="justify-center grid h-5">
        <Container id="formContainer" className="mt-5">
          <Form id="giftForm">
            <TitleText id="formTitle" className="text-2xl pt-4">
              Lahjalistaidea
            </TitleText>
            <Container id="giftNameContainer" className="pt-4 grid">
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
            <Container id="giftReceiverContainer" className="pt-4 grid">
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
              id="submitButton"
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
                    onClick={(event: React.MouseEvent<HTMLElement>) =>
                      handleDeletion(event)
                    }
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
