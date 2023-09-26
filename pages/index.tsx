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
import { getLocalStorage } from '~/utils/localStorage/getLocalStorage';
import { removeLocalStorage } from '~/utils/localStorage/removeLocalStorage';
import { sortGiftsCorrectOrder } from '~/utils/sortGiftsCorrectOrder';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [giftData, setGiftData] = useState<FullLocalStorage[]>([]);
  useEffect(() => {
    isWindow(); // checks if Window is not undefined, else throws an error

    console.log('effect'); // print for knowing useEffect is working
    const fullLocalStorage = sortGiftsCorrectOrder(getFullGiftsLocalStorage()) // fetches an array of objects that contains all of the gifts
    setGiftData(fullLocalStorage); // sets useState to have the fetched gifts
  }, []);



  function handleSubmit() { // handles the event when clicking the submit button
    function clearInputs() { // clears the inputs 
      giftNameInput.value = ""
      giftReceiverInput.value = ""
    }

    const giftNameInput = document.getElementById("giftName") as HTMLInputElement // giftName input element
    const giftReceiverInput = document.getElementById("giftReceiver") as HTMLInputElement // giftReceiver input element
    const giftName: string = giftNameInput.value // gift's name from the input
    const giftReceiver: string = giftReceiverInput.value // receiver name from the input

    if (typeof giftName !== 'string' || giftName.length === 0)
      // if giftName is for example numeral or has 0 letters, throws an error
      throw new Error("Invalid gift's name!");
    if (typeof giftReceiver !== 'string' || giftReceiver.length === 0)
      // if receiverName is for example numeral or has 0 letters, throws an error
      throw new Error("Invalid receiver's name!");

    const generatedUUID = generateUUID(); // generates an UUID. For example: 0a776b46-ec73-440c-a34d-79a2b23cada0
    const localStorageKeyID = generateLocalStorageID('gift', generatedUUID); // generates a gift UUID. For example: gift_0a776b46-ec73-440c-a34d-79a2b23cada0
    const JSON_Object: FullLocalStorage = {
      name: giftReceiver,
      gift: giftName,
      id: generatedUUID,
      localStorageKeyID: localStorageKeyID,
      createdDate: new Date().getTime()
    };

    setLocalStorage(localStorageKeyID, JSON.stringify(JSON_Object)); // sets the data to localStorage
    setGiftData((previousValue) => previousValue.concat(JSON_Object)); // combines two arrays without mutating them
    clearInputs() // clears giftName and giftReceiver inputs
  }

  function handleDeletion(event: React.MouseEvent<HTMLElement>) {
    // handles the event when delete button is pressed
    const parentElementID = event.currentTarget.parentElement?.id; // sets variable to have delete button's <li> element's ID

    let localStorageItem = getLocalStorage(`gift_${parentElementID}`); // gets data from localStorage as a string
    if (typeof localStorageItem !== 'string') {
      // checks if it is string for TypeScript knowing that it can be only string, not string | null
      console.error('localStorageItem was not a string!'); // if for some reason data gotten from localStorage is not a string prints an error
      return; // returns due to an error
    }
    const localStorageData: FullLocalStorage = JSON.parse(localStorageItem); // parses string to object. localStorageData has been set to FullLocalStorage for TS to see object's methods.

    const confirmationForDeleting = confirm(
      `Deleting ${localStorageData.name} - ${localStorageData.gift}`,
    ); // confirmation window that determites if should be deleted or not

    if (confirmationForDeleting) {
      // if confirmation is true
      removeLocalStorage(`gift_${parentElementID}`); // removes the gift from localStorage
    }
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
              type="button"
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
