import { HTMLAttributes, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';
import { TitleBar } from '~/components/TitleBar';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys, Feedback } from '~/shared/types';
import { MessageSquare, FilterIcon, User, Eye, Trash2 } from 'lucide-react';
import { Input } from '~/components/Input';
import { Label } from '~/components/Label';

// ALLOWS ADMINS ONLY, look at the import for more details!
export { getServerSideProps };

const debugData = [
  {
    id: '1',
    feedback:
      'The application is working great! I love the clean interface and how easy it is to navigate. The response time is excellent and I have not encountered any bugs so far.',
    feedbackAdded:
      'Thu May 08 2025 09:36:42 GMT+0300 (Eastern European Summer Time)',
    name: 'Matti Meikäläinen',
    email: 'matti@example.com',
  },
  {
    id: '2',
    feedback:
      'Could you please add a dark mode option? It would be much easier on the eyes during night time usage.',
    feedbackAdded:
      'Wed May 07 2025 14:22:15 GMT+0300 (Eastern European Summer Time)',
    name: 'Anna Virtanen',
    email: 'anna.virtanen@email.fi',
  },
  {
    id: '3',
    feedback:
      'The search functionality seems to be a bit slow when dealing with large datasets. Otherwise, great work!',
    feedbackAdded:
      'Tue May 06 2025 11:45:30 GMT+0300 (Eastern European Summer Time)',
    name: 'Jukka Korhonen',
    email: 'jukka.korhonen@company.com',
  },
  {
    id: '4',
    feedback:
      'Excellent service! The customer support team was very helpful and responsive.',
    feedbackAdded:
      'Mon May 05 2025 16:18:45 GMT+0300 (Eastern European Summer Time)',
    name: 'Liisa Nieminen',
    email: 'liisa@test.fi',
  },
  {
    id: '5',
    feedback:
      'The mobile version could use some improvements. Some buttons are difficult to tap on smaller screens.',
    feedbackAdded:
      'Sun May 04 2025 10:33:22 GMT+0300 (Eastern European Summer Time)',
    name: 'Petri Aalto',
    email: 'petri.aalto@mobile.com',
  },
];

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showUserWindow, setShowUserWindow] = useState(false);

  const { data: feedbacks, error } = useQuery({
    queryKey: QueryKeys.ADMIN_FETCH_FEEDBACKS,
    // the **as Feedback[]** should be fine because the API
    // is only returning an array of Feedbacks or throw an error?
    queryFn: async () => {
      return (await axios.get('/api/feedback')).data as Feedback[];
    },
  });

  return (
    <main className="h-screen w-full max-w-full">
      <div className="flex min-h-screen flex-col">
        <TitleBar
          setShowUserWindow={setShowUserWindow}
          showUserWindow={showUserWindow}
          userDetails={user}
        />
        <div className="flex flex-col items-center">
          <div className="border-lines bg-bg-forms mt-5 w-56 rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <MessageSquare className="text-primary-text size-8" />
              <div>
                <p className="ml-3 text-sm">Palautteita yhteensä</p>
                <p className="ml-3 text-lg font-bold">5</p>
              </div>
            </div>
          </div>
          <div className="border-lines bg-bg-forms mt-5 w-56 rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <User className="text-primary-text size-8" />
              <div>
                <p className="ml-3 text-sm">Uniikit käyttäjät</p>
                <p className="ml-3 text-lg font-bold">5</p>
              </div>
            </div>
          </div>
          <div className="border-lines bg-bg-forms mt-5 w-56 rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <FilterIcon className="text-primary-text size-8" />
              <div>
                <p className="ml-3 text-sm">Suodatetut tulokset</p>
                <p className="ml-3 text-lg font-bold">5</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col">
            <Label htmlFor="feedbackSearch">Etsi palautteita</Label>
            <Input
              className="w-56"
              placeholder="Etsi palautteella, nimellä tai sähköpostiosoitteella"
              name="feedbackSearch"
            />
          </div>

          <FeedbackBlock></FeedbackBlock>
        </div>
      </div>
    </main>
  );
}

function FeedbackBlock() {
  return (
    <table className="block w-56 overflow-auto overflow-y-auto sm:w-96 lg:w-1/2">
      <thead>
        <tr className="">
          <th className="border border-black px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
            Palaute
          </th>
          <th className="border border-black px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
            Palaute lisätty
          </th>
          <th className="border border-black px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
            Nimi
          </th>
          <th className="border border-black px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
            Sähköposti
          </th>
          <th className="border border-black px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
            Valinnat
          </th>
        </tr>
      </thead>
      <tbody className="">
        {debugData.map((_data, _index) => (
          <tr
            key={_data.id}
            className="border-lines border transition-colors hover:bg-gray-100"
          >
            <td className="px-6 py-4">
              <div className="max-w-xs truncate">{_data.feedback}</div>
            </td>
            <td className="px-6 py-4">{_data.feedbackAdded}</td>
            <td className="px-6 py-4">{_data.name}</td>
            <td className="px-6 py-4">{_data.email}</td>
            <td className="px-6 py-4">
              <div className="flex justify-between">
                <button className="border-lines rounded-md border-2">
                  <Eye className="text-primary-text size-6 hover:size-7" />
                </button>
                <button className="border-lines ml-7 rounded-md border-2">
                  <Trash2 className="text-primary-text size-6 hover:size-7" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FeedbackBlock2({
  email,
  feedback,
  feedbackAdded,
  name,
}: {
  feedback: string;
  feedbackAdded: string;
  name: string;
  email: string;
}) {
  return (
    <div className="flex">
      <p className="m-4">{feedback}</p>
      <p className="m-4">{feedbackAdded}</p>
      <p className="m-4">{name}</p>
      <p className="m-4">{email}</p>
    </div>
  );
}

/*
            {debugData.map((_data, _index) => (
              <FeedbackBlock
                email={_data.email}
                feedback={_data.feedback}
                feedbackAdded={_data.feedbackAdded}
                name={_data.name}
              />
            ))}
*/
