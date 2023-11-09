import { Inter } from 'next/font/google';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import jsonServerFunctions from '~/utils/jsonServerFunctions';

const inter = Inter({ subsets: ['latin'] });

export type FullLocalStorage = {
  name: string;
  gift: string;
  id: string;
  localStorageKeyID?: string;
  createdDate: number;
};

export default function Home() {
  const [giftData, setGiftData] = useState<FullLocalStorage[]>([]);
  const [giftNameError, setGiftNameError] = useState(false);
  const [receiverError, setReceiverError] = useState(false);
  const [newReceiver, setNewReceiver] = useState('');
  const [newGiftName, setNewGiftName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalGiftData, setModalGiftData] = useState<FullLocalStorage>();

  useEffect(() => {
    console.log('effect');
    async function fetchData() {
      const gifts = await (await jsonServerFunctions.getAll()).data;
      setGiftData(gifts);
    }
    fetchData();
    /*
    jsonServerFunctions.getAll().then((gifts) => {
      console.log(gifts.data)
      //const parsedGiftData = JSON.parse(getLocalStorage('giftData'));
      //const gifts = sortGiftsOldestFirst(parsedGiftData);
      //setGiftData(gifts);
    }).catch(error => console.log(error))
    */
  }, []);

  async function handleSubmit(e: FormEvent<HTMLElement>) {
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
    const jsonObject: FullLocalStorage = {
      name: newReceiver,
      gift: newGiftName,
      id: generatedUUID,
      createdDate: new Date().getTime(),
    };

    const currentGiftList: FullLocalStorage[] = (
      await jsonServerFunctions.getAll()
    ).data;
    const newGiftList = currentGiftList.concat(jsonObject);

    jsonServerFunctions.create(jsonObject);
    setGiftData(newGiftList);
    setNewGiftName('');
    setNewReceiver('');
  }

  async function refreshGiftList() {
    setGiftData(await (await jsonServerFunctions.getAll()).data);
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
                  <Button
                    key={`${giftItem.id}_deletebutton`}
                    onMouseOver={(e) => {
                      // can use statement *as* here due to the button being inside of the li parentElement
                      (e.currentTarget.parentElement as HTMLElement).className =
                        'line-through';
                    }}
                    onMouseOut={(e) => {
                      // can use statement *as* here due to the button being inside of the li parentElement
                      (e.currentTarget.parentElement as HTMLElement).className =
                        '';
                    }}
                    className="ms-5 p-0 w-16 h-8 hover:text-red-600"
                    onClick={() => {
                      setModalGiftData(giftItem);
                      setOpenModal(true);
                    }}
                    type="button"
                  >
                    Poista
                  </Button>
                </li>
              </div>
            ))}
            {openModal ? (
              <DeleteModal
                gift={modalGiftData!}
                closeModalUseState={setOpenModal}
                giftListRefreshFunction={refreshGiftList}
              />
            ) : null}
          </div>
        </Container>
      </Container>
    </main>
  );
}
