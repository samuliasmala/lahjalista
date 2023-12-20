import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FullLocalStorage } from '~/pages';
import { Modal } from './Modal';
import { TitleText } from './TitleText';
import { Button } from './Button';
import SvgAcceptButtonIcon from '~/icons/accept_button_icon';
import SvgDeclineButtonIcon from '~/icons/decline_button_icon';
import { jsonServerFunctions } from '~/utils/jsonServerFunctions';
import { Input } from './Input';

type EditModal_Type = {
  gift: FullLocalStorage;
  giftListRefreshFunction: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditModal({
  gift,
  giftListRefreshFunction,
  setIsModalOpen,
}: EditModal_Type) {
  const [giftReceiver, setGiftReceiver] = useState('');
  const [giftName, setGiftName] = useState('');

  useEffect(() => {
    setGiftName(gift.gift);
    setGiftReceiver(gift.name);
  }, []);

  async function handleEdit() {
    const giftToBeEdited: FullLocalStorage[] = await jsonServerFunctions.getOne(
      `id=${gift.id}`,
    );
    if (giftToBeEdited.length === 1) {
      const JSON_OBJECT = giftToBeEdited[0];
      JSON_OBJECT.name = giftReceiver;
      JSON_OBJECT.gift = giftName;
      await jsonServerFunctions
        .update(gift.id, JSON_OBJECT)
        .catch(() => giftListRefreshFunction());
    }
    giftListRefreshFunction();
    setIsModalOpen(false);
  }
  return (
    <Modal className="sm:w-[26rem]">
      <TitleText className="row-start-1 row-end-1 ps-3 font-bold text-lg">
        Muokkaus
      </TitleText>
      <div className="row-start-2 row-end-2 grid mt-1 pt-3">
        <label className="row-start-1 row-end-1">Lahja</label>
        <Input
          className="row-start-2 row-end-2 ps-3 pt-5 text-lg w-full h-full font-bold border"
          onChange={(e) => setGiftName(e.target.value)}
          value={giftName}
          name="giftName"
          autoComplete="off"
        />
      </div>
      <div className="row-start-3 row-end-3 grid pt-3">
        <label className="row-start-1 row-end-1">Saaja</label>
        <Input
          className="row-start-2 row-end-2 ps-3 pt-5 text-lg w-full h-full font-bold"
          onChange={(e) => setGiftReceiver(e.target.value)}
          value={giftReceiver}
          autoComplete="off"
        />
      </div>
      <div className="row-start-4 row-end-4 grid">
        <Button className="relative mt-2 left-24 border border-yellow-500 p-0 row-start-1 row-end-1 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300 text-black hover:bg-gray-600 hover:text-yellow-400">
          <SvgAcceptButtonIcon
            width={64}
            height={64}
            onClick={() => void handleEdit()}
          />
        </Button>
        <Button className="mt-2 border border-yellow-500 relative p-0 row-start-1 row-end-1 col-start-2 col-end-2 w-[64px] h-[64px] bg-gray-300 text-black hover:bg-gray-600 hover:text-yellow-400">
          <SvgDeclineButtonIcon
            width={64}
            height={64}
            onClick={() => setIsModalOpen(false)}
          />
        </Button>
      </div>
    </Modal>
  );
}
