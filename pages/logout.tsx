import axios from 'axios';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { validateRequest } from '~/backend/auth';
import { createFeedbackSession } from '~/backend/feedback';
import { Button } from '~/components/Button';
import { Logo } from '~/components/Logo';
import { TitleText } from '~/components/TitleText';
import { CreateFeedback, Feedback } from '~/shared/types';
import { handleGeneralError } from '~/utils/handleError';

const POSSIBLE_ERRORS = {
  'feedback text was not valid!': 'Palauteteksti on virheellinen',
  'feedback text is mandatory!': 'Palauteteksti on pakollinen',
  'server error!': 'Palvelin virhe',
  'palvelin virhe!': 'Palvelin virhe',
  'odottamaton virhe tapahtui!': 'Odottamaton virhe tapahtui',
} as const;

type KnownFrontEndErrorTexts = keyof typeof POSSIBLE_ERRORS;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log('this is logout.tsx');
  const validatedUser = await validateRequest(context.req, context.res);
  if (validatedUser.user) {
    await createFeedbackSession(context, validatedUser.user);
  }
  return {
    props: {},
  };
}

export default function Logout() {
  const [feedbackText, setFeedbackText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [stopRedirect, setStopRedirect] = useState(false);
  const [isInitialRenderDone, setIsInitialRenderDone] = useState(false);

  const router = useRouter();

  useEffect(() => {
    logoutUser().catch((e) => {});
    let redirectTimeout: undefined | NodeJS.Timeout;
    async function addBeforeUnloadEventListener() {
      await logoutUser();
    }
    function clearEventListeners() {
      window.removeEventListener('beforeunload', addBeforeUnloadEventListener);
    }

    if (window && isInitialRenderDone) {
      window.addEventListener('beforeunload', addBeforeUnloadEventListener);
    }
    if (stopRedirect) {
      return clearTimeout(redirectTimeout);
    }
    redirectTimeout = setTimeout(async () => {
      await logoutUser();
      clearEventListeners();
      router.push('/').catch((e) => console.error(e));
    }, 5000);

    setIsInitialRenderDone(true);
    return function clearFunctions() {
      if (isInitialRenderDone) {
        clearEventListeners();
      }
      clearTimeout(redirectTimeout);
    };
  }, [stopRedirect, isInitialRenderDone]);

  async function logoutUser() {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error(e);
    }
  }

  function handleInternalError(e: unknown) {
    console.error(e);
    const errorMessage =
      POSSIBLE_ERRORS[
        handleGeneralError(e).toLowerCase() as KnownFrontEndErrorTexts
      ] || 'Palauteteksti on virheellinen';
    setErrorText(errorMessage);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setStopRedirect(true);
      const dataToSend: CreateFeedback = { feedbackText: feedbackText };
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
    setTimeout(async () => {
      await logoutUser();
      router.push('/').catch((e) => console.error(e));
    }, 10000);
  }

  if (!isFeedbackSent) {
    return (
      <main className="bg-orange-50 w-full max-w-full h-screen ">
        <div className="h-screen w-screen flex flex-col items-center">
          {errorText.length > 0 ? (
            <div className="pt-4 flex justify-center ">
              <div className="max-w-sm text-center bg-red-100 border border-red-400 text-red-700 p-3 rounded [overflow-wrap:anywhere]">
                {errorText}
              </div>
            </div>
          ) : null}
          <div className="max-w-80">
            <Logo />
            <div className="pt-10 flex flex-col items-center">
              <TitleText className="font-bold">Näkemiin!</TitleText>
              <p className="text-center text-sm [overflow-wrap:anywhere] pt-10 text-gray-600">
                Oli ilo auttaa sinua lahjaideoiden kanssa, nähdään pian
                uudelleen!
              </p>
            </div>
            <div className="pt-20">
              <form
                className="flex flex-col text-center"
                onSubmit={(e) => handleSubmit(e)}
              >
                <label className="text-start">Palaute</label>
                <textarea
                  value={feedbackText}
                  className="border border-black h-32 pl-1 pt-1"
                  onChange={(e) => {
                    setStopRedirect(true);
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
                    className="underline cursor-pointer hover:text-blue-500"
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
      <main className="bg-orange-50 w-full max-w-full h-screen ">
        <div className="h-screen w-screen flex flex-col items-center">
          <div className="max-w-80">
            <Logo />
            <div className="pt-10 flex flex-col items-center">
              <TitleText className="font-bold">Kiitos palautteesta!</TitleText>
              <p className="text-center text-sm [overflow-wrap:anywhere] pt-10 text-gray-600">
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
