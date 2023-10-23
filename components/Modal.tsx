import { ButtonHTMLAttributes, useState } from 'react';
import { FullLocalStorage } from '~/pages';
import { Button } from './Button';
import { Container } from './Container';
import { TitleText } from './TitleText';
import {
  getLocalStorage,
  setLocalStorage,
} from '~/utils/localStorageFunctions';
import Image from 'next/image';
import AcceptButtonSVG from '../public/images/icons/accept_button.svg';
import DeclineButtonSVG from '../public/images/icons/decline_button.svg';

type ModalType = ButtonHTMLAttributes<HTMLButtonElement> & {
  gift: FullLocalStorage;
  giftListRefreshFunction?: () => void;
};

export function Modal({
  gift,
  giftListRefreshFunction: giftListRefresh,
  children,
  ...rest
}: ModalType) {
  const [openWindow, setOpenWindow] = useState(false);
  if (typeof gift === 'undefined') return null;

  function handleDeletion() {
    let localStorageGifts: FullLocalStorage[] = JSON.parse(
      getLocalStorage('giftData'),
    );
    localStorageGifts = localStorageGifts.filter(
      (localStorageGift) => localStorageGift.id !== gift.id,
    );
    setLocalStorage('giftData', JSON.stringify(localStorageGifts));
    setOpenWindow(false);
    if (typeof giftListRefresh !== 'undefined') giftListRefresh();
  }

  /*
<svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 32 32"
              className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-5 sm:left-5"
            >
              <path
                onClick={() => handleDeletion()}
                onMouseOver={(e) =>
                  e.currentTarget.setAttribute('fill', '#60946e')
                }
                onMouseOut={(e) =>
                  e.currentTarget.setAttribute('fill', 'currentColor')
                }
                fill="currentColor"
                d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
              />
              <path
                fill="none"
                d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585L14 21.591z"
              />
            </svg>
            <TestIcon className='[&_:nth-child(1)]:fill-yellow-400'/>
*/

  return (
    <>
      {openWindow ? (
        <Container className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <Container className="grid w-96 sm:w-96 border border-yellow-300 bg-gray-200">
            <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
              Deleting:
            </TitleText>
            <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold">{`${gift.gift} - ${gift.name}`}</p>
            <AcceptButtonSVG
              alt="acceptButton"
              width={64}
              height={64}
              className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-5 sm:left-5"
              onClick={() => handleDeletion()}
              onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
                e.currentTarget.classList.add(
                  '[&_:nth-child(1)]:fill-yellow-400',
                )
              }
              onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
                e.currentTarget.classList.remove(
                  '[&_:nth-child(1)]:fill-yellow-400',
                )
              }
            />
            <DeclineButtonSVG
              alt="declineButton"
              width={64}
              height={64}
              className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-32 sm:left-28"
              onClick={() => setOpenWindow(false)}
              onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
                e.currentTarget.classList.add(
                  '[&_:nth-child(1)]:fill-yellow-400',
                )
              }
              onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
                e.currentTarget.classList.remove(
                  '[&_:nth-child(1)]:fill-yellow-400',
                )
              }
            />
          </Container>
        </Container>
      ) : null}
    </>
  );
}
