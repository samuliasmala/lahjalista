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
*/

  return (
    <>
      <Button
        key={`${gift.id}_deletebutton`}
        onMouseOver={(e) => {
          // can use statement *as* here due to the button being inside of the li parentElement
          (e.currentTarget.parentElement as HTMLElement).className =
            'line-through';
        }}
        onMouseOut={(e) => {
          // can use statement *as* here due to the button being inside of the li parentElement
          (e.currentTarget.parentElement as HTMLElement).className = '';
        }}
        className="ms-5 p-0 w-16 h-8 hover:text-red-600"
        onClick={() => setOpenWindow(true)}
        type="button"
        {...rest}
      >
        {children}
      </Button>
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
              onMouseOver={(e: React.MouseEvent<SVGPathElement, MouseEvent>) =>
                e.currentTarget.setAttribute('fill', '#60946e')
              }
              onMouseOut={(e: React.MouseEvent<SVGPathElement, MouseEvent>) =>
                e.currentTarget.setAttribute('fill', 'currentColor')
              }
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              className="relative mt-3 row-start-3 row-end-3 col-start-1 col-end-1 left-32 sm:left-28"
            >
              <path
                onClick={() => setOpenWindow(false)}
                onMouseOver={(e) =>
                  e.currentTarget.setAttribute('fill', '#60946e')
                }
                onMouseOut={(e) =>
                  e.currentTarget.setAttribute('fill', 'currentColor')
                }
                fill="currentColor"
                d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6L8.4 17Zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
              />
            </svg>
          </Container>
        </Container>
      ) : null}
    </>
  );
}
