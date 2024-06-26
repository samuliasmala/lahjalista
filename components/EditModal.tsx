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
import { SvgCheckMarkIcon } from '~/icons/CheckMarkIcon';
import { SvgDeclineIcon } from '~/icons/DeclineIcon';
import { handleGiftError } from '~/utils/handleError';

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
        <TitleText className="row-start-1 row-end-1 ps-3 font-bold text-lg">
          Muokkaus
        </TitleText>
        <div className="row-start-2 row-end-2 grid mt-1 pt-3">
          <label className="row-start-1 row-end-1">Saaja</label>
          <Input
            className="row-start-2 row-end-2 ps-3 pt-5 text-lg w-full h-full font-bold"
            onChange={(e) => setGiftReceiver(e.target.value)}
            value={giftReceiver}
            autoComplete="off"
          />
        </div>
        <div className="row-start-3 row-end-3 grid pt-3">
          <label className="row-start-1 row-end-1">Lahja</label>
          <Input
            className="row-start-2 row-end-2 ps-3 pt-5 text-lg w-full h-full font-bold border"
            onChange={(e) => setGiftName(e.target.value)}
            value={giftName}
            name="giftName"
            autoComplete="off"
          />
        </div>
        <div className="row-start-4 row-end-4 grid">
          <Button
            className="relative mt-2 left-24 border border-yellow-500 p-0 row-start-1 row-end-1 col-start-1 col-end-1 w-[66px] h-[66px] "
            type="submit"
          >
            <SvgCheckMarkIcon
              width={64}
              height={64}
              className="bg-gray-300 hover:bg-gray-600 group/checkMarkIcon"
              circleClassName="fill-black group-hover/checkMarkIcon:fill-yellow-400 "
              checkMarkClassName="fill-gray-300 group-hover/checkMarkIcon:fill-gray-600"
            />
          </Button>

          <Button
            className="mt-2 border border-yellow-500 relative p-0 row-start-1 row-end-1 col-start-2 col-end-2 w-[66px] h-[66px]"
            type="button"
          >
            <SvgDeclineIcon
              className="bg-gray-300 hover:bg-gray-600 group/declineIcon"
              circleClassName="fill-black group-hover/declineIcon:fill-yellow-400"
              width={64}
              height={64}
              onClick={() => setIsModalOpen(false)}
            />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
