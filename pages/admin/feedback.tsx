import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Button } from '~/components/Button';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import { handleErrorToast } from '~/utils/handleToasts';
import { TitleBar } from '~/components/TitleBar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Feedback } from '@prisma/client';
import { useKeyPress } from '~/hooks/useKeyPress';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showUserWindow, setShowUserWindow] = useState(false);

  const router = useRouter();

  useKeyPress('ArrowRight', () => {
    setCurrentPage((currentPageNumber) =>
      calculatePageSwitch(currentPageNumber, totalPages, 'plus'),
    );
  });

  useKeyPress('ArrowLeft', () => {
    setCurrentPage((currentPageNumber) =>
      calculatePageSwitch(currentPageNumber, totalPages, 'minus'),
    );
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/').catch((e) => console.error(e));
      return;
    }
    async function fetchFeedbacks() {
      try {
        const fetchedFeedbacks = (await (
          await axios.get('/api/feedback')
        ).data) as Feedback[];

        setFeedbacks(fetchedFeedbacks);

        // Rounds up the value, eg. 21 feedbacks / 5 = 4.2 -> 5
        // the divider (5) will be changed to generic in the future which allows user to determine how many feedbacks should be shown per page
        setTotalPages(Math.ceil(fetchedFeedbacks.length / 5));
      } catch (e) {
        handleInternalError(e);
      }
    }
    void fetchFeedbacks();
  }, []);

  function handleInternalError(e: unknown) {
    const errorMessage = handleError(e);
    if (
      errorMessage ===
      'Istuntosi on vanhentunut! Ole hyvä ja kirjaudu uudelleen jatkaaksesi!'
    ) {
      router.push('/').catch((e) => console.error(e));
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

function calculatePageSwitch(
  currentPage: number,
  totalPages: number,
  plusOrMinus: 'plus' | 'minus',
): number {
  if (plusOrMinus === 'plus')
    return currentPage + 1 <= totalPages ? currentPage + 1 : 1;

  return currentPage - 1 >= 1 ? currentPage - 1 : totalPages;
}

function FeedbackParagraph({
  currentPage,
  feedbacks,
}: {
  currentPage: number;
  feedbacks: Feedback[];
}) {
  // this will be changed to be a generic in the future
  const howManyFeedbacksPerPage = 5;

  const startNumber =
    currentPage === 1 ? 0 : (currentPage - 1) * howManyFeedbacksPerPage;

  const endNumber =
    currentPage === 1
      ? howManyFeedbacksPerPage
      : startNumber + howManyFeedbacksPerPage;

  const currentFeedbacks = feedbacks.slice(startNumber, endNumber);

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
          setCurrentPage((currentPage) => {
            return calculatePageSwitch(currentPage, totalPages, 'minus');
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
          setCurrentPage((currentPage) => {
            return calculatePageSwitch(currentPage, totalPages, 'plus');
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
