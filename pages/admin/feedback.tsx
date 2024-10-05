import React, { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { handleGeneralError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import { handleErrorToast } from '~/utils/handleToasts';
import { TitleBar } from '~/components/TitleBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Feedback } from '@prisma/client';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showUserWindow, setShowUserWindow] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    }
    async function fetchFeedbacks() {
      try {
        const feedbacks = await (await axios.get('/api/feedback')).data;
        console.log(feedbacks);
        setFeedbacks(feedbacks);
      } catch (e) {
        handleError(e);
      }
    }
    void fetchFeedbacks();
  }, []);

  function handleError(e: unknown) {
    const errorMessage = handleGeneralError(e);
    if (errorMessage === 'You are unauthorized!') {
      window.location.href = '/';
    }
    handleErrorToast(errorMessage);
  }

  return (
    <main className="h-screen w-full max-w-full">
      <TitleBar
        setShowUserWindow={setShowUserWindow}
        showUserWindow={showUserWindow}
        userDetails={user}
      />
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-72">
          <FeedbackParagraph />
        </div>
      </div>
    </main>
  );

  function FeedbackParagraph() {
    const startNumber = currentPage === 1 ? 0 : (currentPage - 1) * 5;
    const endNumber = currentPage === 1 ? 5 : startNumber + 5;
    console.log(startNumber, endNumber);
    const currentFeedbacks = feedbacks.slice(startNumber, endNumber);
    if (feedbacks.length > 0) {
      return (
        <div>
          {currentFeedbacks.map((x) => (
            <>
              <p>
                {x.feedbackText}
                <span> {x.feedbackID}</span>
              </p>
              <p>####################################</p>
            </>
          ))}
        </div>
      );
    }
    return null;
  }

  function PageNavigator() {
    return <p>PageNavigator</p>;
  }
}
