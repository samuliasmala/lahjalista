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
    <Modal className="sm:w-[26rem]">
      <form onSubmit={(e) => void handleEdit(e)}>
        <div className="flex flex-row">
          <TitleText className={`font-medium text-lg p-6 ${jost.className}`}>
            Muokkaa lahjaideaa
          </TitleText>
          <SvgXClose
            width={24}
            height={24}
            className="self-center justify-items-end w-full"
          />
        </div>
        <div className="">
          <label className="">Lahja</label>
          <Input
            className="ps-3 pt-5 text-lg w-full h-full font-bold border"
            onChange={(e) => setGiftName(e.target.value)}
            value={giftName}
            name="giftName"
            autoComplete="off"
          />
        </div>
        <div className="mt-1 pt-3">
          <label className="">Saaja</label>
          <Input
            className="ps-3 pt-5 text-lg w-full h-full font-bold"
            onChange={(e) => setGiftReceiver(e.target.value)}
            value={giftReceiver}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-row justify-end ">
          <Button
            className="w-20 h-8 p-0 bg-white text-black"
            onClick={() => setIsModalOpen(false)}
            type="button"
          >
            Peruuta
          </Button>

          <Button className="ml-6 w-20 h-8 p-0 m-6" type="submit">
            Tallenna
          </Button>
        </div>
      </form>
    </Modal>
  );
}
