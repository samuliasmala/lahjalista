import { TitleText } from './TitleText';
import AcceptButtonSVG from '../public/images/icons/accept_button.svg';
import DeclineButtonSVG from '../public/images/icons/decline_button.svg';
import React, { ButtonHTMLAttributes, Dispatch, SetStateAction } from 'react';
import { FullLocalStorage } from '~/pages';
import {
  getLocalStorage,
  setLocalStorage,
} from '~/utils/localStorageFunctions';
import { Modal } from './Modal';

type ModalType = ButtonHTMLAttributes<HTMLButtonElement> & {
  gift?: FullLocalStorage;
  giftListRefreshFunction?: () => void;
  closeModalUseState: Dispatch<SetStateAction<boolean>>;
};

export function DeleteModal({
  gift,
  giftListRefreshFunction,
  closeModalUseState,
}: ModalType) {
  // olisiko mikä parempi nimi dataToDeleteInfo-variablelle?
  let dataToDeleteInfo = `${gift?.name} - ${gift?.gift}`;
  if (typeof gift === 'undefined') dataToDeleteInfo = 'No data was given';
  if (typeof closeModalUseState === 'undefined') return;

  function handleDeletion() {
    if (typeof giftListRefreshFunction === 'undefined') return;

    let localStorageGifts: FullLocalStorage[] = JSON.parse(
      getLocalStorage('giftData'),
    );
    localStorageGifts = localStorageGifts.filter(
      (localStorageGift) => localStorageGift.id !== gift?.id,
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
      <AcceptButtonSVG
        alt="acceptButton"
        width={64}
        height={64}
        className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-5 sm:left-5"
        onClick={() => handleDeletion()}
        onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
          e.currentTarget.classList.add('[&_:nth-child(1)]:fill-yellow-400')
        }
        onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
          e.currentTarget.classList.remove('[&_:nth-child(1)]:fill-yellow-400')
        }
      />
      <DeclineButtonSVG
        alt="declineButton"
        width={64}
        height={64}
        className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-32 sm:left-28"
        onClick={() => closeModalUseState(false)}
        onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
          e.currentTarget.classList.add('[&_:nth-child(1)]:fill-yellow-400')
        }
        onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
          e.currentTarget.classList.remove('[&_:nth-child(1)]:fill-yellow-400')
        }
      />
    </Modal>
  );
}
