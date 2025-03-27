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
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';
import { handleErrorToast } from '~/utils/handleToasts';
import { TitleBar } from '~/components/TitleBar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useKeyPress } from '~/hooks/useKeyPress';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys, Feedback } from '~/shared/types';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';

// ALLOWS ADMINS ONLY, look at the import for more details!
export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // should not be needed due to Tanstack
  const [feedbacks_old, setFeedbacks_old] = useState<Feedback[]>([]);
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

  const {
    data: feedbacks,
    error,
    refetch,
  } = useQuery({
    queryKey: QueryKeys.ADMIN_FETCH_FEEDBACKS,
    // the **as Feedback[]** should be fine because the API
    // is only returning an array of Feedbacks or throw an error?
    queryFn: async () => {
      return (await axios.get('/api/feedback')).data as Feedback[];
    },
  });

  useShowErrorToast(error);

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

// CHECK THIS, olisiko hyvä nakkaa esim. /utils/utilFunctions.ts-tiedostoon
function calculatePageSwitch(
  currentPage: number,
  totalPages: number,
  plusOrMinus: 'plus' | 'minus',
): number {
  if (plusOrMinus === 'plus')
    return currentPage + 1 <= totalPages ? currentPage + 1 : 1;

  return currentPage - 1 >= 1 ? currentPage - 1 : totalPages;
}

// this handles the individual Feedback. Code loops through all of feedbacks
// and creates same looking elements of them
function FeedbackParagraph({
  currentPage,
  feedbacks,
}: {
  currentPage: number;
  feedbacks?: Feedback[];
}) {
  // this will be changed to be a generic in the future
  const howManyFeedbacksPerPage = 5;

  // if currentPage is 1, we want to startNumber be 0 so we can get
  const startNumber =
    currentPage === 1 ? 0 : (currentPage - 1) * howManyFeedbacksPerPage;

  const endNumber =
    currentPage === 1
      ? howManyFeedbacksPerPage
      : startNumber + howManyFeedbacksPerPage;

  if (!feedbacks || feedbacks.length <= 0) {
    return null;
  }

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

// this handles the number in bottom bar ("Footer") and the
// next and previous buttons
function PageNavigator({
  setCurrentPage,
  currentPage,
  feedbacks,
  totalPages,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  feedbacks?: Feedback[];
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
        {totalPages <= 1 ? (
          currentPage
        ) : (
          <span>
            <select
              onChange={(e) => {
                setCurrentPage(Number(e.target.value) || 1);
              }}
              value={currentPage}
            >
              {feedbacks?.map((_, index) => {
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
        )}{' '}
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
