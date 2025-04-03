import { Gift, QueryKeys } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SvgSpinner from '~/icons/spinner';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';

type DeleteModal = {
  gift: Gift;
  closeModal: () => void;
};

export function DeleteModal({ gift, closeModal }: DeleteModal) {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending } = useMutation({
    mutationKey: QueryKeys.DELETE_GIFT,
    mutationFn: async () => await deleteGift(gift.uuid),
    onSuccess: async () => {
      // refresh gift list
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.GIFTS,
      });
      closeModal();
    },
  });

  useShowErrorToast(error);

  return (
    <Modal className="max-w-80" closeModal={closeModal} title="Poista lahja:">
      <div className="max-w-80">
        <p
          className={`text-primaryText mt-5 ml-4 text-base [overflow-wrap:anywhere]`}
        >
          {gift.gift} - {gift.receiver}
        </p>
        <div className="mt-6 flex flex-row items-center justify-end">
          <Button
            className={`text-primaryText mt-0 mb-6 h-8 w-20 bg-white pt-1 pr-4 pb-1 pl-4 text-sm`}
            onClick={closeModal}
            type="button"
          >
            Peruuta
          </Button>
          <Button
            className={`m-6 mt-0 h-8 w-20 p-0 text-sm disabled:flex disabled:items-center disabled:justify-center`}
            disabled={isPending}
            onClick={() => mutateAsync()}
          >
            {isPending ? (
              <SvgSpinner width={24} height={24} className="animate-spin" />
            ) : (
              'Poista'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
