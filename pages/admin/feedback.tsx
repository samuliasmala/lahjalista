import { useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';
import { TitleBar } from '~/components/TitleBar';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys, Feedback } from '~/shared/types';

// ALLOWS ADMINS ONLY, look at the import for more details!
export { getServerSideProps };

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
        <div className="flex flex-col"></div>
      </div>
    </main>
  );
}
