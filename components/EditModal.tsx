import { FormEvent, useState } from 'react';
import { Gift, QueryKeys } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { updateGift } from '~/utils/apiRequests';
import { Input } from './Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SvgSpinner from '~/icons/spinner';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';
import { handleErrorToast } from '~/utils/handleToasts';
import { handleError } from '~/utils/handleError';
import { errorWrapper } from '~/utils/utilFunctions';

type EditModal = {
  gift: Gift;
  closeModal: () => void;
};

export function EditModal({ gift, closeModal }: EditModal) {
  const [giftReceiver, setGiftReceiver] = useState(gift.receiver);
  const [giftName, setGiftName] = useState(gift.gift);

  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (gitfData: { receiver: string; gift: string }) => {
      await updateGift(gift.uuid, gitfData);
    },
    onSuccess: async () => {
      // refresh gift list
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.GIFTS,
      });
      closeModal();
    },
  });

  useShowErrorToast(error);

  async function handleEdit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      await mutateAsync({
        receiver: giftReceiver,
        gift: giftName,
      });
    } catch (e) {
      handleErrorToast(handleError(e));
      return;
    }
  }

  return (
    <Modal
      className="max-w-80"
      closeModal={closeModal}
      title="Muokkaa lahjaideaa:"
    >
      <form onSubmit={(e) => errorWrapper(async () => await handleEdit(e))}>
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
              onClick={() => closeModal()}
              type="button"
            >
              Peruuta
            </Button>
            <Button
              className="ml-6 mt-0 h-8 w-20 p-0 text-sm disabled:flex disabled:items-center disabled:justify-center"
              type="submit"
              disabled={isPending}
              onClick={(e) => void handleEdit(e)}
            >
              {isPending ? (
                <SvgSpinner width={24} height={24} className="animate-spin" />
              ) : (
                'Tallenna'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
