import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  const [visibleHeight, setVisibleHeight] = useState<number>(0);
  const [scrolledDistance, setScrolledDistance] = useState<number>(190);
  const isMount = useRef(false);

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
      <div className="flex min-h-screen flex-col">
        <TitleBar
          setShowUserWindow={setShowUserWindow}
          showUserWindow={showUserWindow}
          userDetails={user}
        />
        <div className="flex flex-col">
          <div className="w-full max-w-72 self-center">
            <FeedbackParagraph
              currentPage={currentPage}
              feedbacks={feedbacks}
            />
          </div>
        </div>
        <Footer>
          <PageNavigator
            currentPage={currentPage}
            feedbacks={feedbacks}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </Footer>
      </div>
    </main>
  );
}

function FeedbackParagraph({
  currentPage,
  feedbacks,
}: {
  currentPage: number;
  feedbacks: Feedback[];
}) {
  const howManyFeedbacksPerPage = 5;
  const startNumber =
    currentPage === 1 ? 0 : (currentPage - 1) * howManyFeedbacksPerPage;
  const endNumber =
    currentPage === 1
      ? howManyFeedbacksPerPage
      : startNumber + howManyFeedbacksPerPage;
  //console.log(startNumber, endNumber);
  const currentFeedbacks = feedbacks.slice(startNumber, endNumber);
  //console.log(currentFeedbacks, feedbacks);
  if (feedbacks.length > 0) {
    return (
      <div className="w-full">
        {currentFeedbacks.map((x, index) => (
          <div
            className="mb-4 whitespace-pre-line border-4 [overflow-wrap:anywhere]"
            key={index}
          >
            <p>{x.feedbackText}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function PageNavigator({
  setCurrentPage,
  currentPage,
  feedbacks,
  totalPages,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  feedbacks: Feedback[];
  totalPages: number;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Button
        className="text-md m-0 mr-4 h-10 w-24 p-0"
        onClick={() =>
          setCurrentPage((prevValue) => {
            return prevValue - 1 >= 1 ? prevValue - 1 : 1;
          })
        }
      >
        {'<'} Edellinen
      </Button>
      <div>
        <span>
          <select
            onChange={(e) => {
              setCurrentPage(Number(e.target.value) || 1);
            }}
            value={currentPage}
          >
            {feedbacks.map((_, index) => {
              if (index <= totalPages && index > 0) {
                return (
                  <option value={index} key={index}>
                    {index}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </span>
        / {totalPages}{' '}
      </div>
      <Button
        className="text-md m-0 ml-4 h-10 w-24 p-0"
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
}

function Footer({ children }: { children?: ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto h-24 w-full self-center bg-primaryLight sm:w-96">
      {children}
    </div>
  );
}
