import { TitleText } from './TitleText';
import React, { Dispatch, SetStateAction } from 'react';
import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { deleteGift } from '~/utils/apiRequests';
import { handleGiftError } from '~/utils/handleError';
import { jost } from '~/utils/fonts';
import SvgXClose from '~/icons/x_close';

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
      handleGiftError(e);
    }
    refreshGiftList();
    setIsModalOpen(false);
  }

  return (
    <Modal className="w-80">
      <div className="max-w-80">
        <div className="m-4 mb-0 flex flex-row justify-between">
          <TitleText
            className={`mt-0 font-medium text-primaryText text-base ${jost.className} `}
          >
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
          className={`ml-4 mt-5 text-primaryText ${jost.className} text-base [overflow-wrap:anywhere]`}
        >
          {gift.gift} - {gift.receiver}
        </p>
        <div className="flex flex-row justify-end items-center mt-6">
          <Button
            className={`w-20 h-8 mb-6 mt-0 pt-1 pb-1 pl-4 pr-4 bg-white text-primaryText text-sm ${jost.className}`}
            onClick={() => setIsModalOpen(false)}
            type="button"
          >
            Peruuta
          </Button>

          <Button
            className={`m-6 mt-0 w-16 h-8 p-0 text-sm ${jost.className}`}
            onClick={() => void handleDeletion()}
          >
            Poista
          </Button>
        </div>
      </div>
    </Modal>
  );
}
