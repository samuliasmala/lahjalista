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
import SvgXClose from '~/icons/x_close';
import { handleErrorToast } from '~/utils/handleToasts';

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
      handleErrorToast(handleGiftError(e));
    }
    refreshGiftList();
    setIsModalOpen(false);
  }
  return (
    <Modal className="max-w-80">
      <form onSubmit={(e) => void handleEdit(e)}>
        <div className="flex flex-row justify-between">
          <TitleText className={`m-6 text-base font-medium text-primaryText`}>
            Muokkaa lahjaideaa
          </TitleText>
          <SvgXClose
            width={24}
            height={24}
            className="mr-6 self-center hover:cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <div className="m-6 mt-0 flex flex-col">
          <label className="pb-1">Lahja</label>
          <Input
            className="pb-2.5 pt-2.5"
            onChange={(e) => setGiftName(e.target.value)}
            value={giftName}
            name="giftName"
            autoComplete="off"
          />
          <label className="pb-1 pt-4">Saaja</label>
          <Input
            className="pb-2.5 pt-2.5"
            onChange={(e) => setGiftReceiver(e.target.value)}
            value={giftReceiver}
            autoComplete="off"
          />
          <div className="mt-8 flex flex-row items-center justify-end">
            <Button
              className="mt-0 h-8 w-20 bg-white p-0 text-sm text-primaryText"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Peruuta
            </Button>

            <Button className="ml-6 mt-0 h-8 w-20 p-0 text-sm" type="submit">
              Tallenna
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
