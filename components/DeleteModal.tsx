import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import SvgSpinner from '~/icons/spinner';

type DeleteModal = {
  gift: Gift;
  refreshGiftList: () => Promise<void>;
  closeModal: () => void;
};

export function DeleteModal({
  gift,
  refreshGiftList,
  closeModal,
}: DeleteModal) {
  const deleteGiftQuery = useQuery({
    queryKey: ['deletingGift'],
    enabled: false,
    queryFn: () => handleDeletion(),
  });

  async function handleDeletion() {
    try {
      await deleteGift(gift.uuid);
    } catch (e) {
      handleErrorToast(handleError(e));
    }
    closeModal();
    refreshGiftList();
    return 'deletingGift';
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
            className={`mb-6 mt-0 h-8 w-20 bg-white p-0 text-sm text-primaryText`}
            onClick={() => closeModal()}
            type="button"
          >
            Peruuta
          </Button>
          {deleteGiftQuery.isFetching ? (
            <Button
              className={`m-6 mt-0 h-8 w-28 cursor-not-allowed bg-red-500 p-0 text-sm`}
              disabled
              onClick={() => void deleteGiftQuery.refetch()}
            >
              Poista
              <span className="absolute ml-2">
                <SvgSpinner width={18} height={18} className="animate-spin" />
              </span>
            </Button>
          ) : (
            <Button
              className={`m-6 mt-0 h-8 w-20 p-0 text-sm`}
              onClick={() => void deleteGiftQuery.refetch()}
            >
              Poista
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
