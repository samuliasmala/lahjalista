import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Button } from '~/components/Button';
import { User } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import { jost } from '~/utils/fonts';
import { TitleText } from '~/components/TitleText';
import { TitleBar } from '~/components/Titlebar';
import Image from 'next/image';
import SvgLocationPin from '~/icons/location_pin';
import SvgCalendar from '~/icons/calendar';
import SvgPencilEdit from '~/icons/pencil_edit';
import { Modal } from '~/components/Modal';
import SvgXClose from '~/icons/x_close';
import { Input } from '~/components/Input';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isAnyKindOfError, setIsAnyKindOfError] = useState(false);
  const [isAnyKindOfErrorMessage, setIsAnyKindOfErrorMessage] = useState('');
  const [showUserWindow, setShowUserWindow] = useState(false);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  // most likely unnecessary, but it is here for now
  const [currentDate, setCurrentDate] = useState('31.7.2024');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    try {
      console.log('effect');
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
    } catch (e) {
      handleError(e);
    }
  }, []);

  function handleError(e: unknown) {
    const errorMessage = handleGeneralError(e);
    setIsAnyKindOfError(true);
    setIsAnyKindOfErrorMessage(errorMessage);
  }

  return (
    <main className="h-screen w-full max-w-full">
      <TitleBar
        setShowUserWindow={setShowUserWindow}
        showUserWindow={showUserWindow}
        user={user}
      />
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center justify-center sm:max-w-96">
          <TitleText className="ml-7 mt-5 self-start font-normal text-black">
            Profiili
          </TitleText>
          <div className="mt-6 flex flex-col items-center justify-center rounded-md border border-primary bg-neutral-100">
            <Image
              src={'/images/person.png'}
              alt="person smiling"
              width={150}
              height={150}
              className="ml-14 mr-14 mt-8 rounded-full"
              priority={true}
            />
            <div className="items-cen ml-14 mr-14 mt-7 flex flex-col gap-1">
              <p className={`text-lg font-semibold ${jost.className}`}>
                {firstName} {lastName}
              </p>
              <p className={`${jost.className} text-sm`}>{email}</p>
              <div className="flex">
                <SvgLocationPin width={20} height={20} />
                <p className={`ml-1 ${jost.className} text-sm`}>
                  Location / maybe country?
                </p>
              </div>
              <div className="flex">
                <SvgCalendar width={20} height={20} />
                <p className={`ml-1 ${jost.className} text-sm`}>31.7.2024</p>
              </div>
            </div>
            <SvgPencilEdit
              onClick={() => setShowEditModal(true)}
              width={24}
              height={24}
              className="mb-3 mr-4 self-end hover:cursor-pointer"
            />
          </div>

          {isAnyKindOfError && (
            <div className="fixed bottom-0 left-0 z-[98] flex w-full items-center justify-center">
              <div className="z-[99] w-full bg-red-600 p-10 text-center" />
              <span className="fixed z-[99] animate-bounce text-5xl">
                {isAnyKindOfErrorMessage}
              </span>
            </div>
          )}

          {showEditModal && (
            <EditModal
              handleError={handleError}
              setShowEditModal={setShowEditModal}
              userDetails={{
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

type EditModal = {
  userDetails: Pick<User, 'email' | 'firstName' | 'lastName'>;
  setShowEditModal: Dispatch<SetStateAction<boolean>>;
  handleError: (e: unknown) => void;
};

function EditModal({ userDetails, setShowEditModal, handleError }: EditModal) {
  const [email, setEmail] = useState(userDetails.email);
  const [firstName, setFirstName] = useState(userDetails.firstName);
  const [lastName, setLastName] = useState(userDetails.lastName);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowEditModal(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return function clearFunctions() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowEditModal]);

  async function handleEdit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
    } catch (e) {
      handleError(e);
    }
    setShowEditModal(false);
  }
  return (
    <Modal className="max-w-80">
      <form onSubmit={(e) => void handleEdit(e)}>
        <div className="flex flex-row justify-between">
          <TitleText
            className={`m-6 text-base font-medium text-primaryText ${jost.className}`}
          >
            Muokkaa käyttäjätietoja
          </TitleText>
          <SvgXClose
            width={24}
            height={24}
            className="mr-6 self-center hover:cursor-pointer"
            onClick={() => setShowEditModal(false)}
          />
        </div>
        <div className="m-6 mt-0 flex flex-col">
          <label className="pb-1">Etunimi</label>
          <Input
            className="pb-2.5 pt-2.5"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            name="giftName"
            autoComplete="off"
          />
          <label className="pb-1 pt-4">Sukunimi</label>
          <Input
            className="pb-2.5 pt-2.5"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            autoComplete="off"
          />
          <label className="pb-1 pt-4">Sähköposti</label>
          <Input
            className="pb-2.5 pt-2.5"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="off"
          />
          <div className="mt-8 flex flex-row items-center justify-end">
            <Button
              className="mt-0 h-8 w-20 bg-white p-0 text-sm text-primaryText"
              onClick={() => setShowEditModal(false)}
              type="button"
            >
              Peruuta
            </Button>

            <Button className="ml-6 mt-0 h-8 w-20 p-0 text-sm" type="submit">
              Tallenna
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
