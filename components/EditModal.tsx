import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { TitleText } from './TitleText';
import { Button } from './Button';
import { updateGift } from '~/utils/apiRequests';
import { Input } from './Input';
import { handleGiftError } from '~/utils/handleError';
import { jost } from '~/utils/fonts';
import SvgXClose from '~/icons/x_close';

type EditModal = {
  gift: Gift;
  refreshGiftList: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditModal({
  gift,
  refreshGiftList,
  setIsModalOpen,
}: EditModal) {
  const [giftReceiver, setGiftReceiver] = useState(gift.receiver);
  const [giftName, setGiftName] = useState(gift.gift);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return function clearFunctions() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [refreshGiftList, setIsModalOpen]);

  async function handleEdit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      await updateGift(gift.uuid, { receiver: giftReceiver, gift: giftName });
    } catch (e) {
      handleGiftError(e);
    }
    refreshGiftList();
    setIsModalOpen(false);
  }
  return (
    <Modal className="w-80 h-80">
      <form onSubmit={(e) => void handleEdit(e)}>
        <div className="flex flex-row">
          <TitleText className={`font-medium text-lg p-6 ${jost.className}`}>
            Muokkaa lahjaideaa
          </TitleText>
          {/* Onko tarpeeksi hyvä, vai pitäisikö SvgXClosen classNameen esim ml-[4.5rem] joka olis täysin oikea arvok*/}
          <SvgXClose
            width={24}
            height={24}
            className="self-center hover:cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        {/* CHECK THIS, liian monta div-wrapperia?*/}
        <div className="p-6 pt-0 flex flex-col">
          <label className="pb-1">Lahja</label>
          <Input
            className="text-lg font-bold border"
            onChange={(e) => setGiftName(e.target.value)}
            value={giftName}
            name="giftName"
            autoComplete="off"
          />
          <label className="pt-4 pb-1">Saaja</label>
          <Input
            className="text-lg font-bold"
            onChange={(e) => setGiftReceiver(e.target.value)}
            value={giftReceiver}
            autoComplete="off"
          />
          <div className="flex flex-row justify-end pt-8">
            <Button
              className="w-20 h-8 p-0 bg-white text-black"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Peruuta
            </Button>

            <Button className="ml-6 w-20 h-8 p-0 mr-6" type="submit">
              Tallenna
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
