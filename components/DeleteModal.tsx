import { TitleText } from './TitleText';
import React, { ButtonHTMLAttributes, Dispatch, SetStateAction } from 'react';
import { FullLocalStorage, isGiftDeletedAlreadyType } from '~/pages';
import { Modal, ModalType } from './Modal';
import jsonServerFunctions from '~/utils/jsonServerFunctions';
import { AcceptButtonIcon, DeclineButtonIcon } from '~/icons';

type DeleteModalType = ButtonHTMLAttributes<HTMLButtonElement> &
  ModalType & {
    gift: FullLocalStorage;
    giftListRefreshFunction: () => any;
    closeModalUseState: Dispatch<SetStateAction<boolean>>;
  };

export function DeleteModal(props: DeleteModalType) {
  const {
    gift,
    giftListRefreshFunction,
    closeModalUseState,
    ...rest
  } = props;
  // olisiko mikä parempi nimi dataToDeleteInfo-variablelle?
  const dataToDeleteInfo = `${gift.name} - ${gift.gift}`;
  async function handleDeletion() {
    await jsonServerFunctions
      .remove(`${gift.id}`)
      .catch(() => giftListRefreshFunction());
    giftListRefreshFunction();
    closeModalUseState(false);
  }

  return (
    <Modal {...rest}>
      <TitleText className="row-start-1 row-end-1 ps-5 font-bold">
        Deleting:
      </TitleText>
      <p className="row-start-2 row-end-2 ps-5 pt-5 text-lg w-full h-full font-bold">
        {dataToDeleteInfo}
      </p>
      <button
        className="border border-yellow-500 mt-3 row-start-3 row-end-3 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300"
        onClick={() => handleDeletion()}
        onMouseOver={(e) => {
          e.currentTarget.classList.remove('bg-gray-300');
          e.currentTarget.classList.add('bg-gray-600');
        }}
        onMouseOut={(e) => {
          e.currentTarget.classList.remove('bg-gray-600');
          e.currentTarget.classList.add('bg-gray-300');
        }}
      >
        <AcceptButtonIcon
          width={64}
          height={64}
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
        className="border border-yellow-500 mt-3 left-32 sm:left-28 row-start-3 row-end-3 col-start-1 col-end-1 w-[64px] h-[64px] bg-gray-300"
        onClick={() => closeModalUseState(false)}
        onMouseOver={(e) => {
          e.currentTarget.classList.remove('bg-gray-300');
          e.currentTarget.classList.add('bg-gray-600');
        }}
        onMouseOut={(e) => {
          e.currentTarget.classList.remove('bg-gray-600');
          e.currentTarget.classList.add('bg-gray-300');
        }}
      >
        <DeclineButtonIcon
          width={64}
          height={64}
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
