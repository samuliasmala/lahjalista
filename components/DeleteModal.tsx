import { TitleText } from './TitleText';
import React, { ButtonHTMLAttributes, Dispatch, SetStateAction } from 'react';
import { FullLocalStorage } from '~/pages';
import {
  getLocalStorage,
  setLocalStorage,
} from '~/utils/localStorageFunctions';
import { Modal } from './Modal';
import SvgAcceptButtonIcon from '~/icons/accept_button_icon';
import SvgDeclineButtonIcon from '~/icons/decline_button_icon';

type ModalType = {
  gift: FullLocalStorage;
  giftListRefreshFunction: () => void;
  closeModalUseState: Dispatch<SetStateAction<boolean>>;
};

export function DeleteModal({
  gift,
  giftListRefreshFunction,
  closeModalUseState,
}: ModalType) {
  let dataToDeleteInfo = `${gift.name} - ${gift.gift}`;

  function handleDeletion() {
    let localStorageGifts: FullLocalStorage[] = JSON.parse(
      getLocalStorage('giftData'),
    );
    localStorageGifts = localStorageGifts.filter(
      (localStorageGift) => localStorageGift.id !== gift.id,
    );
    setLocalStorage('giftData', JSON.stringify(localStorageGifts));
    giftListRefreshFunction();
    closeModalUseState(false);
  }

  return (
    <Modal>
      <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
        Deleting:
      </TitleText>
      <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold">
        {dataToDeleteInfo}
      </p>
      <button
        className="border border-yellow-500 mt-3 row-start-3 row-end-3 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300"
        onMouseOver={(e) => {
          e.currentTarget.classList.remove('bg-gray-300');
          e.currentTarget.classList.add('bg-gray-600');
        }}
        onMouseOut={(e) => {
          e.currentTarget.classList.remove('bg-gray-600');
          e.currentTarget.classList.add('bg-gray-300');
        }}
      >
        <SvgAcceptButtonIcon
          width={64}
          height={64}
          onClick={() => handleDeletion()}
          onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
            e.currentTarget.classList.add('[&_:nth-child(1)]:fill-yellow-400')
          }
          onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
            e.currentTarget.classList.remove(
              '[&_:nth-child(1)]:fill-yellow-400',
            )
          }
        />
      </button>
      <button
        className="border border-yellow-500 relative mt-3 left-32 sm:left-28 row-start-3 row-end-3 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300"
        onMouseOver={(e) => {
          e.currentTarget.classList.remove('bg-gray-300');
          e.currentTarget.classList.add('bg-gray-600');
        }}
        onMouseOut={(e) => {
          e.currentTarget.classList.remove('bg-gray-600');
          e.currentTarget.classList.add('bg-gray-300');
        }}
      >
        <SvgDeclineButtonIcon
          width={64}
          height={64}
          onClick={() => closeModalUseState(false)}
          onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
            e.currentTarget.classList.add('[&_:nth-child(1)]:fill-yellow-400')
          }
          onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
            e.currentTarget.classList.remove(
              '[&_:nth-child(1)]:fill-yellow-400',
            )
          }
        />
      </button>
    </Modal>
  );
}
