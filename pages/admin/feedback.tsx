import React, { useEffect, useRef, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showUserWindow, setShowUserWindow] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
    }
    async function fetchFeedbacks() {
      try {
        const fetchedFeedbacks = (await (
          await axios.get('/api/feedback')
        ).data) as Feedback[];
        //console.log(fetchedFeedbacks);
        setFeedbacks(fetchedFeedbacks);

        // Rounds up the value, eg. 21 feedbacks / 5 = 4.2 -> 5
        setTotalPages(Math.ceil(fetchedFeedbacks.length / 5));
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
    //console.log(startNumber, endNumber);
    const currentFeedbacks = feedbacks.slice(startNumber, endNumber);
    //console.log(currentFeedbacks, feedbacks);
    if (feedbacks.length > 0) {
      return (
        <div>
          {currentFeedbacks.map((x, index) => (
            <div key={index}>
              <p>
                {x.feedbackText}
                <span> {x.feedbackID}</span>
              </p>
              <p>####################################</p>
            </div>
          ))}
          <PageNavigator />
        </div>
      );
    }
    return null;
  }

  function PageNavigator() {
    const [whatToRender, setWhatToRender] = useState<number[]>([]);
    const isMount = useRef(false);

    useEffect(() => {
      if (!isMount.current) {
        const newWhatToRender = [
          ...(currentPage - 1 > 0 ? [currentPage - 1] : []),
          ...(currentPage - 2 > 0 ? [currentPage - 2] : []),
          ...(currentPage + 1 < totalPages ? [currentPage + 1] : []),
          ...(currentPage + 2 < totalPages ? [currentPage + 2] : []),
        ];
        /*
        // backwards numbers
        currentPage - 1 > 0 ? secondArray.push(currentPage - 1) : null;
        currentPage - 2 > 0 ? secondArray.push(currentPage - 2) : null;
        // forward numbers
        currentPage + 1 >= totalPages
          ? null
          : secondArray.push(currentPage + 1);
        currentPage + 2 >= totalPages
          ? null
          : secondArray.push(currentPage + 2);
          */
        console.log(newWhatToRender);
        setWhatToRender((prevValue) => {
          return [...prevValue].concat(newWhatToRender);
        });

        isMount.current = true;
      }
    }, []);

    return (
      <div className="mt-4 flex justify-center">
        <Button
          className="text-md m-0 mr-4 h-auto w-auto p-0"
          onClick={() =>
            setCurrentPage((prevValue) => {
              return prevValue - 1 >= 1 ? prevValue - 1 : 1;
            })
          }
        >
          {'<'} Edellinen
        </Button>
        {whatToRender.map((x, index) => {
          return (
            <div className="border-4" key={index}>
              {x}
            </div>
          );
        })}
        <div>Current page: {currentPage}</div>
        <Button
          className="text-md m-0 ml-4 h-auto w-auto p-0"
          onClick={() =>
            setCurrentPage((prevValue) => {
              return prevValue + 1 <= totalPages ? prevValue + 1 : totalPages;
            })
          }
        >
          Seuraava {'>'}
        </Button>
      </div>
    );

    function PageNumberBox() {
      return <div className="border-4">Placeholder</div>;
    }
  }
}
