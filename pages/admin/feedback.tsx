import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';
import { TitleBar } from '~/components/TitleBar';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys, CustomFeedback } from '~/shared/types';
import {
  MessageSquare,
  FilterIcon,
  User as UserSVG,
  Eye,
  Trash2,
} from 'lucide-react';
import { Input } from '~/components/Input';
import { Label } from '~/components/Label';
import { Modal } from '~/components/Modal';
import { Button } from '~/components/Button';
import { toast } from 'react-toastify';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';

// ALLOWS ADMINS ONLY, look at the import for more details!
export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showUserWindow, setShowUserWindow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalData, setDeleteModalData] = useState('');
  const [showMoreModalData, setShowMoreModalData] = useState<
    CustomFeedback | undefined
  >(undefined);

  const { data: feedbacks, error } = useQuery({
    queryKey: QueryKeys.ADMIN_FETCH_FEEDBACKS,
    // the **as Feedback[]** should be fine because the API
    // is only returning an array of Feedbacks or throw an error?
    queryFn: async () => {
      return (await axios.get('/api/feedback?includeUser=true'))
        .data as CustomFeedback[];
    },
  });

  useShowErrorToast(error);

  if (!feedbacks) {
    // this prevents user seeing "Virhe tapahtui" if error really hasn't happened
    // if internet connection is slow, user saw the error message eventhough error hadn't happened
    return error ? (
      <div className="text-center text-4xl">
        Virhe tapahtui palautteita noutaessa
      </div>
    ) : null;
  }

  const totalFeedbacks = feedbacks.length;

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.feedbackText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.User.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.User.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.User.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const uniqueUsers = new Set(feedbacks.map((feedback) => feedback.User.email))
    .size;

  const searchTermResults = filteredFeedbacks.length;

  return (
    <main className="h-screen w-full max-w-full">
      <div className="flex min-h-screen flex-col">
        <TitleBar
          setShowUserWindow={setShowUserWindow}
          showUserWindow={showUserWindow}
          userDetails={user}
        />
        <div className="flex flex-col items-center">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center">
            <div className="border-lines bg-bg-forms mt-5 w-56 rounded-lg border p-6 shadow-sm sm:mr-2 sm:ml-2">
              <div className="flex items-center">
                <MessageSquare className="text-primary-text size-8" />
                <div>
                  <p className="ml-3 text-sm">Palautteita yhteensä</p>
                  <p className="ml-3 text-lg font-bold">{totalFeedbacks}</p>
                </div>
              </div>
            </div>
            <div className="border-lines bg-bg-forms mt-5 w-56 rounded-lg border p-6 shadow-sm sm:mr-2 sm:ml-2">
              <div className="flex items-center">
                <UserSVG className="text-primary-text size-8" />
                <div>
                  <p className="ml-3 text-sm">Uniikit käyttäjät</p>
                  <p className="ml-3 text-lg font-bold">{uniqueUsers}</p>
                </div>
              </div>
            </div>
            <div className="border-lines bg-bg-forms mt-5 w-56 rounded-lg border p-6 shadow-sm sm:mr-2 sm:ml-2">
              <div className="flex items-center">
                <FilterIcon className="text-primary-text size-8" />
                <div>
                  <p className="ml-3 text-sm">Suodatetut tulokset</p>
                  <p className="ml-3 text-lg font-bold">{searchTermResults}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col">
            <Label htmlFor="feedbackSearch">Etsi palautteita</Label>
            <Input
              className="w-56 sm:w-96"
              placeholder="Etsi palautteella, nimellä tai sähköpostiosoitteella"
              name="feedbackSearch"
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </div>

          <div className="mt-12 flex w-full justify-center">
            <FeedbackBlock
              feedbacks={filteredFeedbacks}
              setDeleteModalData={setDeleteModalData}
              setShowMoreModalData={setShowMoreModalData}
            />
          </div>
          {deleteModalData.length > 0 && (
            <DeleteModal
              closeModal={() => setDeleteModalData('')}
              feedbackText={deleteModalData}
            />
          )}
          {showMoreModalData && (
            <ShowMoreModal
              closeModal={() => setShowMoreModalData(undefined)}
              feedback={showMoreModalData}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function FeedbackBlock({
  feedbacks,
  setDeleteModalData,
  setShowMoreModalData,
}: {
  feedbacks: CustomFeedback[];
  setDeleteModalData: Dispatch<SetStateAction<string>>;
  setShowMoreModalData: Dispatch<SetStateAction<CustomFeedback | undefined>>;
}) {
  return (
    <table className="block w-56 overflow-auto overflow-y-auto sm:w-96 lg:w-1/2">
      <thead>
        <tr className="">
          <Th>Palaute</Th>
          <Th>Palaute lisätty</Th>
          <Th>Nimi</Th>
          <Th>Sähköposti</Th>
          <Th>Valinnat</Th>
        </tr>
      </thead>
      <tbody className="">
        {feedbacks.map((_data, _index) => (
          <tr
            key={`feedback_${_index}`}
            className="border-lines border transition-colors hover:bg-gray-100"
          >
            <td className="px-6 py-4">
              <div className="max-w-xs truncate">{_data.feedbackText}</div>
            </td>
            <td className="px-6 py-4">
              {new Date(_data.createdAt).toLocaleDateString('fi-FI', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </td>
            <td className="px-6 py-4">
              {_data.User.firstName} {_data.User.lastName}
            </td>
            <td className="px-6 py-4">{_data.User.email}</td>
            <td className="px-6 py-4">
              <div className="flex justify-between">
                <button
                  className="border-lines group rounded-md border-2 hover:bg-gray-300"
                  onClick={() => setShowMoreModalData(_data)}
                >
                  <Eye className="text-primary-text size-6" />
                </button>
                <button
                  className="border-lines ml-7 rounded-md border-2 hover:bg-gray-300"
                  onClick={() => setDeleteModalData(_data.feedbackText)}
                >
                  <Trash2 className="text-primary-text size-6" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border border-black px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
      {children}
    </th>
  );
}

function ShowMoreModal({
  closeModal,
  feedback,
}: {
  closeModal: () => void;
  feedback: CustomFeedback;
}) {
  return (
    <Modal
      closeModal={closeModal}
      title="Palautteen lisätiedot:"
      className="max-w-80"
    >
      <div className="mr-4 ml-4 flex flex-col">
        <div>
          <p className="font-bold">Palaute:</p>
          <p className="rounded border bg-gray-50 p-3 text-sm text-gray-900">
            {feedback.feedbackText}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-bold">Palaute lisätty:</p>
          <p className="rounded border bg-gray-50 p-3 text-sm text-gray-900">
            {new Date(feedback.createdAt).toLocaleDateString('fi-FI', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-bold">Nimi:</p>
          <p className="rounded border bg-gray-50 p-3 text-sm text-gray-900">
            {feedback.User.firstName} {feedback.User.lastName}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-bold">Sähköposti:</p>
          <p className="rounded border bg-gray-50 p-3 text-sm text-gray-900">
            {feedback.User.email}
          </p>
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            className={`text-primary-text mt-0 mb-6 h-8 w-20 bg-white pt-1 pr-4 pb-1 pl-4 text-sm`}
            onClick={() => closeModal()}
          >
            Sulje
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function DeleteModal({
  closeModal,
  feedbackText,
}: {
  closeModal: () => void;
  feedbackText: string;
}) {
  return (
    <Modal
      className="max-w-80"
      title="Poistetaan palaute:"
      closeModal={closeModal}
    >
      <div className="ml-4">
        <p>{feedbackText}</p>
        <div className="mt-6 flex justify-center">
          <Button
            className={`text-primary-text mt-0 mb-6 h-8 w-20 bg-white pt-1 pr-4 pb-1 pl-4 text-sm`}
            onClick={() => closeModal()}
          >
            Peruuta
          </Button>
          <Button
            className={`m-6 mt-0 h-8 w-20 p-0 text-sm disabled:flex disabled:items-center disabled:justify-center`}
            onClick={() => {
              toast('Poista-toiminto ei ole vielä käytettävissä');
            }}
          >
            Poista
          </Button>
        </div>
      </div>
    </Modal>
  );
}
