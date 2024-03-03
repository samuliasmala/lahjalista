import { TitleText } from './TitleText';
import React, { Dispatch, SetStateAction } from 'react';
import { Gift } from '~/shared/types';
import { Modal } from './Modal';
import { Button } from './Button';
import { SvgCheckMarkIcon } from '~/icons/CheckMarkIcon';
import { SvgDeclineIcon } from '~/icons/DeclineIcon';
import { deleteGift } from '~/utils/giftRequests';
import { isAxiosError } from 'axios';

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
      if (isAxiosError(e) && e.response?.status === 404) {
        console.error('Lahjaa ei löytynyt palvelimelta!');
      } else if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
    refreshGiftList();
    setIsModalOpen(false);
  }

  return (
    <Modal>
      <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
        Deleting:
      </TitleText>
      <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold overflow-auto">
        {gift.receiver} - {gift.gift}
      </p>
      <Button className="border border-yellow-500 mt-3 p-0 row-start-3 row-end-3 col-start-1 col-end-1 w-[66px] h-[66px]">
        <SvgCheckMarkIcon
          className="bg-gray-300 hover:bg-gray-600 group/checkMarkIcon"
          circleClassName="fill-black group-hover/checkMarkIcon:fill-yellow-400"
          checkMarkClassName="fill-gray-300 group-hover/checkMarkIcon:fill-gray-600"
          width={64}
          height={64}
          onClick={() => void handleDeletion()}
        />
      </Button>
      <Button className="border border-yellow-500 relative mt-3 p-0 left-32 sm:left-28 row-start-3 row-end-3 col-start-1 col-end-1 w-[66px] h-[66px] ">
        <SvgDeclineIcon
          className="group/declineIcon bg-gray-300 hover:bg-gray-600"
          circleClassName="fill-black group-hover/declineIcon:fill-yellow-400"
          width={64}
          height={64}
          onClick={() => setIsModalOpen(false)}
        />
      </Button>
    </Modal>
  );
}
