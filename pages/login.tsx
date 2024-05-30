import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { validateRequest } from '~/backend/auth';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Logo } from '~/components/Logo';
import { TitleText } from '~/components/TitleText';
import SvgEyeOpen from '~/icons/eye_open';
import SvgEyeSlash from '~/icons/eye_slash';
import { isEmailValid } from '~/shared/isValidFunctions';
import { UserLoginDetails } from '~/shared/types';
import { handleAuthErrors } from '~/utils/handleError';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user) {
    return {
      props: {},
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (isEmailValid(email)) {
        if (password.length <= 0) {
          return setErrorText('Salasana-kenttä ei voi olla tyhjä!');
        }
        const loginCredentials: UserLoginDetails = {
          email: email,
          password: password,
          rememberMe: rememberMe,
        };
        await axios.post('/api/auth/login', loginCredentials);
        await router.push('/');
      } else {
        setErrorText('Sähköposti ei ole sääntöjen mukainen!');
      }
    } catch (e) {
      console.error(e);
      setErrorText(handleAuthErrors(e));
    }
  }

  const SvgEye = showPassword ? SvgEyeSlash : SvgEyeOpen;

  return (
    <main className="bg-orange-50 w-full max-w-full h-screen ">
      <div className="h-screen w-screen">
        {errorText.length > 0 ? (
          <div className="pt-4 flex justify-center ">
            <div className="max-w-sm text-center bg-red-100 border border-red-400 text-red-700 p-3 rounded [overflow-wrap:anywhere]">
              {errorText}
            </div>
          </div>
        ) : null}
        <div className="w-full flex justify-center">
          <div className="mt-5 flex flex-col">
            <Logo />
            <form onSubmit={(e) => void handleSubmit(e)}>
              <TitleText className="text-center">Kirjaudu sisään</TitleText>
              <div className="mt-5 flex flex-col">
                <label>Sähköposti</label>
                <Input
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  value={email}
                  className="border border-black pl-8 pr-8"
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="email"
                  spellCheck="false"
                />
              </div>
              <div className="mt-5 flex flex-col">
                <label>Salasana</label>
                <div className="flex rounded-md outline outline-1 border-black hover:bg-gray-100 has-[input:focus]:outline-2 has-[input:focus]:rounded group/password">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className="pl-1 pt-3 pb-3 border-0 outline-none group-hover/password:bg-gray-100"
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="************"
                    name="password"
                  />
                  <div className="group-hover/password:bg-gray-100 hover:bg-white bg-white flex items-center ">
                    <SvgEye
                      className="w-8 h-8 cursor-pointer p-0 hover:stroke-yellow-600 "
                      onClick={() => {
                        setShowPassword((prevValue) => !prevValue);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex mt-3 align-middle">
                <label className="select-none cursor-pointer flex">
                  <input
                    type="checkbox"
                    className="mr-2 cursor-pointer w-6 h-6 accent-emerald-500 "
                    onClick={() => setRememberMe((prevValue) => !prevValue)}
                  />
                  Muista minut
                </label>
              </div>
              <Button type="submit">Kirjaudu</Button>
            </form>
            <p className="mt-6 text-xs text-gray-600 text-center">
              Ei ole vielä tunnuksia?{' '}
              <Link
                href={'/register'}
                className="underline cursor-pointer hover:text-blue-500"
              >
                Luo tunnus
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
