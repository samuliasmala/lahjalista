import { TitleText } from './TitleText';
import { Dispatch, SetStateAction } from 'react';
import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import SvgXClose from '~/icons/x_close';
import { toast } from 'react-toastify';

type DeleteModal = {
  gift: Gift;
  refreshGiftList: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function DeleteModal({
  gift,
  refreshGiftList,
  setIsModalOpen,
}: DeleteModal) {
  async function handleDeletion() {
    try {
      await deleteGift(gift.uuid);
    } catch (e) {
      toast(handleError(e), { type: 'error' });
    }
    refreshGiftList();
    setIsModalOpen(false);
  }

  return (
    <Modal className="w-80">
      <div className="max-w-80">
        <div className="m-4 mb-0 flex flex-row justify-between">
          <TitleText className={`mt-0 text-base font-medium text-primaryText`}>
            Olet poistamassa lahjaa:
          </TitleText>
          <SvgXClose
            width={24}
            height={24}
            className="self-center hover:cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <p
          className={`ml-4 mt-5 text-base text-primaryText [overflow-wrap:anywhere]`}
        >
          {gift.gift} - {gift.receiver}
        </p>
        <div className="mt-6 flex flex-row items-center justify-end">
          <Button
            className={`mb-6 mt-0 h-8 w-20 bg-white pb-1 pl-4 pr-4 pt-1 text-sm text-primaryText`}
            onClick={() => setIsModalOpen(false)}
            type="button"
          >
            Peruuta
          </Button>

          <Button
            className={`m-6 mt-0 h-8 w-16 p-0 text-sm`}
            onClick={() => void handleDeletion()}
          >
            Poista
          </Button>
        </div>
      </div>
    </Modal>
  );
}
