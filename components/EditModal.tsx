import { FormEvent, useState } from 'react';
import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { updateGift } from '~/utils/apiRequests';
import { Input } from './Input';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';
import { useMutation } from '@tanstack/react-query';
import SvgSpinner from '~/icons/spinner';

type EditModal = {
  gift: Gift;
  refreshGiftList: () => Promise<void>;
  closeModal: () => void;
};

export function EditModal({ gift, refreshGiftList, closeModal }: EditModal) {
  const [giftReceiver, setGiftReceiver] = useState(gift.receiver);
  const [giftName, setGiftName] = useState(gift.gift);

  const editGiftQuery = useMutation({
    mutationFn: async (gitfData: { receiver: string; gift: string }) => {
      await updateGift(gift.uuid, gitfData);
      await refreshGiftList();
    },
  });

  async function handleEdit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      await editGiftQuery.mutateAsync({
        receiver: giftReceiver,
        gift: giftName,
      });
    } catch (e) {
      handleErrorToast(handleError(e));
    }
    closeModal();
  }

  return (
    <Modal
      className="max-w-80"
      closeModal={() => closeModal()}
      title="Muokkaa lahjaideaa:"
    >
      <form onSubmit={(e) => void handleEdit(e)}>
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
            {editGiftQuery.isPending ? (
              <Button
                className="ml-6 mt-0 h-8 w-28 cursor-not-allowed bg-red-500 p-0 pl-4 text-start text-sm"
                type="submit"
                disabled
              >
                Tallenna
                <span className="absolute">
                  <SvgSpinner className="ml-2 size-5 animate-spin" />
                </span>
              </Button>
            ) : (
              <Button className="ml-6 mt-0 h-8 w-20 p-0 text-sm" type="submit">
                Tallenna
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
