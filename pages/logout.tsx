import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { validateRequest } from '~/backend/auth';
import { Button } from '~/components/Button';
import { Logo } from '~/components/Logo';
import { TitleText } from '~/components/TitleText';
import { CreateFeedback } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';

const POSSIBLE_ERRORS = {
  'feedback was invalid!': 'Palauteteksti on virheellinen',
  'feedback text is mandatory!': 'Palauteteksti on pakollinen',
  'server error!': 'Palvelin virhe',
  'palvelin virhe!': 'Palvelin virhe',
  'odottamaton virhe tapahtui!': 'Odottamaton virhe tapahtui',
  'you are unauthorized!':
    'Istuntosi on vanhentunut! Ole hyvä ja kirjaudu uudelleen antaaksesi palautteen',
} as const;

type KnownFrontEndErrorTexts = keyof typeof POSSIBLE_ERRORS;

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
  const [errorText, setErrorText] = useState('');
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const router = useRouter();

  function handleInternalError(e: unknown) {
    console.error(e);
    const errorMessage =
      POSSIBLE_ERRORS[
        handleGeneralError(e).toLowerCase() as KnownFrontEndErrorTexts
      ] || 'Palauteteksti tai yksilöintitunnus on virheellinen';
    setErrorText(errorMessage);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (feedbackText.length <= 0) {
        return setErrorText('Palauteteksti on pakollinen!');
      }

      const dataToSend: CreateFeedback = {
        feedbackText,
      };

      await axios.post('/api/feedback', dataToSend);
      feedbackSent();
    } catch (e) {
      handleInternalError(e);
    }
  }

  function feedbackSent() {
    setErrorText('');
    setFeedbackText('');
    setIsFeedbackSent(true);
    setTimeout(() => {
      router.push('/login').catch((e) => console.error(e));
    }, 5000);
  }

  if (!isFeedbackSent) {
    return (
      <main className="h-screen w-full max-w-full bg-orange-50">
        <div className="flex h-screen w-screen flex-col items-center">
          {errorText.length > 0 ? (
            <div className="flex justify-center pt-4">
              <div className="max-w-sm rounded border border-red-400 bg-red-100 p-3 text-center text-red-700 [overflow-wrap:anywhere]">
                {errorText}
              </div>
            </div>
          ) : null}
          <div className="max-w-80">
            <Logo />
            <div className="flex flex-col items-center pt-10">
              <TitleText className="font-bold">Näkemiin!</TitleText>
              <p className="pt-10 text-center text-sm text-gray-600 [overflow-wrap:anywhere]">
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
                  className="h-32 border border-black pl-1 pt-1"
                  onChange={(e) => {
                    setFeedbackText(e.currentTarget.value);
                  }}
                />
                <Button className="p-2" type="submit">
                  Lähetä
                </Button>
                <p className="select-none pt-6 text-xs text-gray-600">
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
  } else {
    return (
      <main className="h-screen w-full max-w-full bg-orange-50">
        <div className="flex h-screen w-screen flex-col items-center">
          <div className="max-w-80">
            <Logo />
            <div className="flex flex-col items-center pt-10">
              <TitleText className="font-bold">Kiitos palautteesta!</TitleText>
              <p className="pt-10 text-center text-sm text-gray-600 [overflow-wrap:anywhere]">
                Oli ilo auttaa sinua lahjaideoiden kanssa, nähdään pian
                uudelleen!
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
