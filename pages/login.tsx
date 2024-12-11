import axios from 'axios';
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
import { QueryKeys, UserLoginDetails } from '~/shared/types';
import { handleError } from '~/utils/handleError';
import { emailSchema } from '~/shared/zodSchemas';
import { Label } from '~/components/Label';
import { GetServerSidePropsContext } from 'next';
import { handleErrorToast } from '~/utils/handleToasts';
import { ErrorParagraph } from '~/components/ErrorParagraph';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCatchQueryErrors } from '~/hooks/useCatchQueryErrors';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user || !cookieData.session.isLoggedIn) {
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

type ErrorFieldNames = 'email' | 'password';
type ErrorTypes = Partial<Record<ErrorFieldNames, string | undefined>>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<ErrorTypes>({});

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: QueryKeys.LOGIN,
    mutationFn: async () => await handleLogin({ email, password, rememberMe }),
  });

  useCatchQueryErrors(error);
  /*
  const loginQuery = useQuery({
    queryKey: ['login'],
    enabled: false,
    queryFn: async () => await handleLogin({ email, password, rememberMe }),
  });
  */

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setErrors({});
      let errorFound = false;

      const emailValidation = emailSchema.safeParse(email);
      if (emailValidation.success === false) {
        setErrors((prevValue) => {
          return {
            ...prevValue,
            email:
              emailValidation.error.format()._errors[0] ||
              'Virheellinen sähköposti',
          };
        });
        errorFound = true;
      }

      if (password.length <= 0) {
        setErrors((prevValue) => {
          return {
            ...prevValue,
            password: 'Salasana on pakollinen',
          };
        });
        errorFound = true;
      }

      if (errorFound) {
        return;
      }

      console.log(await mutateAsync());
    } catch (e) {
      console.error(e);
      handleErrorToast(handleError(e));
    }
  }

  async function handleLogin(loginCredentials: UserLoginDetails) {
    try {
      console.log('Logging in...');
      await axios.post('/api/auth/login', loginCredentials);
      await router.push('/');
    } catch (e) {
      console.error(e);
      handleErrorToast(handleError(e));
    }
    // useQuery requires a return that IS NOT undefined
    // more: https://github.com/TanStack/query/discussions/4457
    return QueryKeys.LOGIN;
  }

  const SvgEye = showPassword ? SvgEyeSlash : SvgEyeOpen;

  return (
    <main className={`h-screen w-full max-w-full bg-bgPage`}>
      <div className="h-screen w-screen">
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-72 flex-col">
            <Logo wrapperClassName="mb-3" />
            <form onSubmit={(e) => void handleSubmit(e)}>
              <TitleText className="mt-3">Kirjaudu sisään</TitleText>
              <div className="flex flex-col pt-12">
                <Label>Sähköposti</Label>
                <Input
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  value={email}
                  className="border border-lines pr-0"
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="email"
                  spellCheck="false"
                />
              </div>
              <ErrorParagraph errorText={errors.email} />
              <div className="flex flex-col pt-6">
                <Label>Salasana</Label>
                <div className="flex justify-between rounded-md border-lines bg-bgForms outline outline-1 has-[input:focus]:rounded has-[input:focus]:outline-2">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className={`w-full border-0 outline-none ${!showPassword && password.length > 0 ? 'input-enlarge-password-mask-character-size' : ''}`}
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="************"
                    name="password"
                  />
                  <div className="flex items-center rounded-md bg-bgForms has-[input:focus]:rounded has-[input:focus]:outline-2">
                    <SvgEye
                      className="h-8 w-8 cursor-pointer p-0 text-lines"
                      onClick={() => {
                        setShowPassword((prevValue) => !prevValue);
                      }}
                    />
                  </div>
                </div>
              </div>
              <ErrorParagraph errorText={errors.password} />
              <div className="flex pt-4 align-middle">
                <Label className={`flex cursor-pointer select-none`}>
                  <input
                    type="checkbox"
                    className={`mr-2 h-6 w-6 cursor-pointer accent-lines`}
                    onClick={() => setRememberMe((prevValue) => !prevValue)}
                  />
                  Muista minut
                </Label>
              </div>
              {isPending ? (
                <Button
                  type="submit"
                  className="cursor-not-allowed bg-red-500"
                  disabled
                >
                  Kirjaudutaan sisään
                  <span className="loading-dots absolute" />
                </Button>
              ) : (
                <Button type="submit">Kirjaudu sisään</Button>
              )}
            </form>
            <p className={`mt-4 text-center text-xs text-gray-500`}>
              Ei vielä tunnuksia?{' '}
              <Link
                href={'/register'}
                className={`cursor-pointer underline hover:text-blue-500`}
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
