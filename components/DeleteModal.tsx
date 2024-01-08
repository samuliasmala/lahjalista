import { TitleText } from './TitleText';
import React, { Dispatch, SetStateAction } from 'react';
import { Gifts } from '~/pages';
import { Modal } from './Modal';
import jsonServerFunctions from '~/utils/jsonServerFunctions';
import SvgAcceptButtonIcon from '~/icons/accept_button_icon';
import SvgDeclineButtonIcon from '~/icons/decline_button_icon';
import { Button } from './Button';

type ModalType = {
  gift: Gifts;
  giftListRefreshFunction: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function DeleteModal({
  gift,
  giftListRefreshFunction,
  setIsModalOpen,
}: ModalType) {
  async function handleDeletion() {
    const giftToBeDeleted: any[] = await jsonServerFunctions.getOne(
      `id=${gift.id}`,
    );
    if (giftToBeDeleted.length != 0) {
      await jsonServerFunctions
        .remove(`${gift.id}`)
        .catch(() => giftListRefreshFunction());
    }
    giftListRefreshFunction();
    setIsModalOpen(false);
  }

  return (
    <Modal>
      <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
        Deleting:
      </TitleText>
      <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold">
        {gift.name} - {gift.gift}
      </p>
      <Button className="border border-yellow-500 mt-3 p-0 row-start-3 row-end-3 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300 text-black hover:bg-gray-600 hover:text-yellow-400">
        <SvgAcceptButtonIcon
          width={64}
          height={64}
          onClick={() => void handleDeletion()}
        />
      </Button>
      <Button className="border border-yellow-500 relative mt-3 p-0 left-32 sm:left-28 row-start-3 row-end-3 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300 text-black hover:bg-gray-600 hover:text-yellow-400">
        <SvgDeclineButtonIcon
          width={64}
          height={64}
          onClick={() => setIsModalOpen(false)}
        />
      </Button>
    </Modal>
  );
}
