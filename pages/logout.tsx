import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { validateRequest } from '~/backend/auth-lahjalista';
import { Button } from '~/components/Button';
import { Logo } from '~/components/Logo';
import { TitleText } from '~/components/TitleText';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';
import SvgSpinner from '~/icons/spinner';
import { CreateFeedback, QueryKeys } from '~/shared/types';
import { handleError } from '~/utils/handleError';
import { handleErrorToast } from '~/utils/handleToasts';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user || !cookieData.session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  if (cookieData.session.isLoggedIn) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  return {
    props: {},
  };
}

export default function Logout() {
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const router = useRouter();

  const { mutateAsync, error, isPending } = useMutation({
    mutationKey: QueryKeys.CREATE_FEEDBACK,
    mutationFn: async (dataToSend: CreateFeedback) => {
      await axios.post('/api/feedback', dataToSend);
    },
    onSuccess: () => feedbackSent(),
  });

  useShowErrorToast(error);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (feedbackText.length <= 0) {
        throw new Error('Feedback text is mandatory!');
      }

      const dataToSend: CreateFeedback = {
        feedbackText,
      };

      await mutateAsync(dataToSend);
    } catch (e) {
      handleErrorToast(handleError(e));
    }
  }

  function feedbackSent() {
    setFeedbackText('');
    setIsFeedbackSent(true);
    setTimeout(() => {
      router.push('/login').catch((e) => console.error(e));
    }, 5000);
  }

  if (!isFeedbackSent) {
    return (
      <main className="h-screen w-full max-w-full">
        <div className="flex h-screen w-screen flex-col items-center">
          <div className="max-w-80">
            <Logo />
            <div className="flex flex-col items-center pt-10">
              <TitleText className="font-bold">Näkemiin!</TitleText>
              <p className="pt-10 text-center text-sm [overflow-wrap:anywhere] text-gray-600">
                Oli ilo auttaa sinua lahjaideoiden kanssa, nähdään pian
                uudelleen!
              </p>
            </div>
            <div className="pt-20">
              <form
                className="flex flex-col text-center"
                onSubmit={(e) => void handleSubmit(e)}
              >
                <label className="text-start">Palaute</label>
                <textarea
                  value={feedbackText}
                  className="bg-bg-forms h-32 border border-black pt-1 pl-1"
                  onChange={(e) => {
                    setFeedbackText(e.currentTarget.value);
                  }}
                />
                <Button className="p-2" type="submit" disabled={isPending}>
                  {isPending ? (
                    <SvgSpinner
                      width={28}
                      height={28}
                      className="animate-spin justify-self-center"
                    />
                  ) : (
                    'Lähetä'
                  )}
                </Button>
                <p className="pt-6 text-xs text-gray-600 select-none">
                  Saitko uuden idean?{' '}
                  <Link
                    href={'/login'}
                    className="cursor-pointer underline hover:text-blue-500"
                  >
                    Kirjaudu uudelleen
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full max-w-full">
      <div className="flex h-screen w-screen flex-col items-center">
        <div className="max-w-80">
          <Logo />
          <div className="flex flex-col items-center pt-10">
            <TitleText className="font-bold">Kiitos palautteesta!</TitleText>
            <p className="pt-10 text-center text-sm [overflow-wrap:anywhere] text-gray-600">
              Oli ilo auttaa sinua lahjaideoiden kanssa, nähdään pian uudelleen!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
