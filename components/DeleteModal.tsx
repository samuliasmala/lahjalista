import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';
import { toast } from 'react-toastify';

type DeleteModal = {
  gift: Gift;
  refreshGiftList: () => void;
  closeModal: () => void;
};

export function DeleteModal({
  gift,
  refreshGiftList,
  closeModal,
}: DeleteModal) {
  async function handleDeletion() {
    try {
      closeModal();
      toast('Test', { type: 'info' });
      await deleteGift(gift.uuid);
    } catch (e) {
      handleErrorToast(handleError(e));
    }
    refreshGiftList();
  }

  return (
    <Modal
      className="max-w-80"
      closeModal={() => closeModal()}
      title="Poista lahja:"
    >
      <div className="max-w-80">
        <p
          className={`ml-4 mt-5 text-base text-primaryText [overflow-wrap:anywhere]`}
        >
          {gift.gift} - {gift.receiver}
        </p>
        <div className="mt-6 flex flex-row items-center justify-end">
          <Button
            className={`mb-6 mt-0 h-8 w-20 bg-white pb-1 pl-4 pr-4 pt-1 text-sm text-primaryText`}
            onClick={() => closeModal()}
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
