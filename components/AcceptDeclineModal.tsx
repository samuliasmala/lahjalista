import { TitleText } from './TitleText';
import AcceptButtonSVG from '../public/images/icons/accept_button.svg';
import DeclineButtonSVG from '../public/images/icons/decline_button.svg';
import React, { ButtonHTMLAttributes } from 'react';
import { FullLocalStorage } from '~/pages';
import { Container } from './Container';
import { getLocalStorage, setLocalStorage } from '~/utils/localStorageFunctions';

type ModalType = ButtonHTMLAttributes<HTMLButtonElement> & {
  gift: FullLocalStorage;
  giftListRefreshFunction?: () => void;
  acceptButtonFunction?: () => void;
  declineButtonFunction?: () => void;
};




export function AcceptDeclineModal({
  gift,
  giftListRefreshFunction,
  acceptButtonFunction,
  children,
  ...rest
}: ModalType) {

  function handleDeletion() {
    let localStorageGifts: FullLocalStorage[] = JSON.parse(
      getLocalStorage('giftData'),
    );
    localStorageGifts = localStorageGifts.filter(
      (localStorageGift) => localStorageGift.id !== gift.id,
    );
    setLocalStorage('giftData', JSON.stringify(localStorageGifts));
    //setOpenWindow(false);
    //if (typeof giftListRefresh !== 'undefined') giftListRefresh();
  }
  




  return (
    <Container>
      <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
        Deleting:
      </TitleText>
      <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold">{`${gift.gift} - ${gift.name}`}</p>
      <AcceptButtonSVG
        alt="acceptButton"
        width={64}
        height={64}
        className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-5 sm:left-5"
        onClick={() => console.log("test accept")}
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
        onClick={() => console.log("Test decline")}
        onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
          e.currentTarget.classList.add('[&_:nth-child(1)]:fill-yellow-400')
        }
        onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
          e.currentTarget.classList.remove('[&_:nth-child(1)]:fill-yellow-400')
        }
      />
      ;
    </Container>
  );
}
