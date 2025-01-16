import { Gift, QueryKeys } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
            className={`m-6 mt-0 h-8 w-20 p-0 text-sm disabled:w-24 disabled:pr-4`}
            disabled={isPending}
            onClick={async () => {
              try {
                await mutateAsync();
              } catch (e) {
                /*
                  this catch's idea is to prevent fatal error from occuring which would break the whole site
                  useShowErrorToast(error) handles the showing of the error
                */
                return;
              }
            }}
          >
            Poista
            {isPending && (
              <span className="absolute ml-2">
                <SvgSpinner width={18} height={18} className="animate-spin" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
