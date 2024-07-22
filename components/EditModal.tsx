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
    <Modal className="max-w-80">
      <form onSubmit={(e) => void handleEdit(e)}>
        <div className="flex flex-row justify-between">
          <TitleText
            className={`font-medium text-primaryText text-base m-6 ${jost.className}`}
          >
            Muokkaa lahjaideaa
          </TitleText>
          <SvgXClose
            width={24}
            height={24}
            className="self-center hover:cursor-pointer mr-6"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <div className="m-6 mt-0 flex flex-col">
          <label className="pb-1">Lahja</label>
          <Input
            className="pt-2.5 pb-2.5"
            onChange={(e) => setGiftName(e.target.value)}
            value={giftName}
            name="giftName"
            autoComplete="off"
          />
          <label className="pt-4 pb-1">Saaja</label>
          <Input
            className="pt-2.5 pb-2.5"
            onChange={(e) => setGiftReceiver(e.target.value)}
            value={giftReceiver}
            autoComplete="off"
          />
          <div className="flex flex-row justify-end items-center mt-8">
            <Button
              className="mt-0 w-20 h-8 p-0 bg-white text-primaryText text-sm"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Peruuta
            </Button>

            <Button className="ml-6 mt-0 w-20 h-8 p-0 text-sm" type="submit">
              Tallenna
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
