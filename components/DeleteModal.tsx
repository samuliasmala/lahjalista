import { Dispatch, SetStateAction } from 'react';
import { Gift, QueryKeys } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';
import { useQueryClient } from '@tanstack/react-query';

type DeleteModal = {
  gift: Gift;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function DeleteModal({ gift, setIsModalOpen }: DeleteModal) {
  const queryClient = useQueryClient();

  async function handleDeletion() {
    try {
      await deleteGift(gift.uuid);
    } catch (e) {
      handleErrorToast(handleError(e));
    }
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.GIFTS,
    });

    setIsModalOpen(false);
  }

  return (
    <Modal
      className="max-w-80"
      closeModal={() => setIsModalOpen(false)}
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
