import { Dispatch, SetStateAction } from 'react';
import { FullLocalStorage } from '~/pages';
import { Modal } from './Modal';
import { TitleText } from './TitleText';
import { Button } from './Button';
import SvgAcceptButtonIcon from '~/icons/accept_button_icon';
import SvgDeclineButtonIcon from '~/icons/decline_button_icon';
import testiImportti from '~/utils/jsonServerFunctions';

type ModifyModal_Type = {
  gift: FullLocalStorage;
  giftListRefreshFunction: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function ModifyModal({
  gift,
  giftListRefreshFunction,
  setIsModalOpen,
}: ModifyModal_Type) {
  async function handleModifying() {}

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
          onClick={() => void handleModifying()}
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

/*const giftToBeDeleted: any[] = await jsonServerFunctions.getOne(
      `id=${gift.id}`,
    );
    if (giftToBeDeleted.length != 0) {
      await jsonServerFunctions
        .remove(`${gift.id}`)
        .catch(() => giftListRefreshFunction());
    }
    giftListRefreshFunction();
    setIsModalOpen(false);*/