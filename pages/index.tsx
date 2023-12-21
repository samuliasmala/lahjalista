import { Inter } from 'next/font/google';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { Input } from '../components/Input';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { jsonServerFunctions } from '~/utils/jsonServerFunctions';
import SvgGearIcon from '~/icons/gear_icon';
import { Modal } from '~/components/Modal';

const inter = Inter({ subsets: ['latin'] });

export type FullLocalStorage = {
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
  const [giftData, setGiftData] = useState<FullLocalStorage[]>([]);
  const [giftNameError, setGiftNameError] = useState(false);
  const [receiverError, setReceiverError] = useState(false);
  const [newReceiver, setNewReceiver] = useState('');
  const [newGiftName, setNewGiftName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalGiftData, setDeleteModalGiftData] =
    useState<FullLocalStorage>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalGiftData, setEditModalGiftData] =
    useState<FullLocalStorage>();
  const [isGiftSettingsModalOpen, setIsGiftSettingsModalOpen] = useState(true);
  const [giftSettingsModalGiftData, setGiftSettingsModalGiftData] =
    useState<FullLocalStorage>();

  useEffect(() => {
    console.log('effect');
    async function fetchData() {
      const gifts = await (await jsonServerFunctions.getAll()).data;
      setGiftData(gifts);
    }
    fetchData().catch((e) => {
      throw new Error(e);
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    setGiftNameError(false);
    setReceiverError(false);
    // this variable is used for checking both inputs
    // could use return statement instead of errorFound, but it would not give an error message to all invalid input. Only the first invalid input.
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
    const JSON_OBJECT: FullLocalStorage = {
      name: newReceiver,
      gift: newGiftName,
      id: generatedUUID,
      createdDate: new Date().getTime(),
    };

    const currentGiftList: FullLocalStorage[] = (
      await jsonServerFunctions.getAll()
    ).data;
    const updatedGiftList = currentGiftList.concat(JSON_OBJECT);

    await jsonServerFunctions.create(JSON_OBJECT);
    setGiftData(updatedGiftList);
    setNewGiftName('');
    setNewReceiver('');
  }

  async function refreshGiftList() {
    setGiftData(await (await jsonServerFunctions.getAll()).data);
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div className="justify-center grid h-5">
        <div className="mt-5">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <TitleText>Lahjalistaidea</TitleText>
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
            <Button type="submit">Lisää</Button>
          </form>
        </div>
        <div className="mt-3">
          <TitleText>Lahjaideat</TitleText>
          <div>
            {giftData.map((giftItem) => (
              <div
                key={`${giftItem.id}_divbutton`}
                className="animate-width whitespace-nowrap overflow-hidden w-auto h-14"
              >
                <li key={giftItem.id}>
                  {giftItem.name} - {giftItem.gift}
                  <Button
                    className="border-none bg-white p-0 mt-0 ms-3 w-auto h-auto relative top-3 hover:bg-gray-200"
                    type="button"
                    onClick={() => {
                      setIsGiftSettingsModalOpen(true);
                      setGiftSettingsModalGiftData(giftItem);
                    }}
                  >
                    <SvgGearIcon width={35} height={35} />
                  </Button>
                </li>
              </div>
            ))}
            {isGiftSettingsModalOpen && giftSettingsModalGiftData && (
              <Modal className="grid justify-center w-96 h-40 sm:w-[10rem] sm:h-[10rem]">
                <Button
                  key={`${giftSettingsModalGiftData.id}_deletebutton`}
                  className="row-start-1 row-end-1 mt-2 p-0 w-16 h-8 hover:text-red-600 pointer-events-auto"
                  onClick={() => {
                    setDeleteModalGiftData(giftSettingsModalGiftData);
                    setIsDeleteModalOpen(true);
                    setIsGiftSettingsModalOpen(false);
                  }}
                  type="button"
                >
                  Poista
                </Button>
                <Button
                  key={`${giftSettingsModalGiftData.id}_editbutton`}
                  className="row-start-2 row-end-2 sm:mb-20 sm:mt-2 mb-[3.5rem] mt-0 p-0 w-20 h-8 hover:text-yellow-400"
                  onClick={() => {
                    setEditModalGiftData(giftSettingsModalGiftData);
                    setIsEditModalOpen(true);
                    setIsGiftSettingsModalOpen(false);
                  }}
                  type="button"
                >
                  Muokkaa
                </Button>
                <Button
                  className="fixed sm:left-20 sm:top-32 right-0 -bottom-[0.7rem] mt-0 p-0 w-20 h-8 mb-3"
                  type="button"
                  onClick={() => setIsGiftSettingsModalOpen(false)}
                >
                  Peruuta
                </Button>
              </Modal>
            )}

            {isEditModalOpen && editModalGiftData && (
              <EditModal
                gift={editModalGiftData}
                giftListRefreshFunction={() => void refreshGiftList()}
                setIsModalOpen={setIsEditModalOpen}
              />
            )}

            {isDeleteModalOpen && deleteModalGiftData && (
              <DeleteModal
                gift={deleteModalGiftData}
                giftListRefreshFunction={() => void refreshGiftList()}
                setIsModalOpen={setIsDeleteModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
