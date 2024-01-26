import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Gift } from '~/pages';
import { Modal } from './Modal';
import { TitleText } from './TitleText';
import { Button } from './Button';
import { updateGift } from '~/utils/giftRequests';
import { Input } from './Input';
import { SvgCheckMarkIcon } from '~/icons/CheckMarkIcon';
import { SvgDeclineIcon } from '~/icons/DeclineIcon';

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
  const [giftReceiver, setGiftReceiver] = useState('');
  const [giftName, setGiftName] = useState('');

  useEffect(() => {
    setGiftName(gift.gift);
    setGiftReceiver(gift.name);
  }, [gift]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        refreshGiftList();
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

    const newGift = gift;
    newGift.name = giftReceiver;
    newGift.gift = giftName;
    await updateGift(gift.id, newGift).catch(() => {
      refreshGiftList();
      setIsModalOpen(false);
    });
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
