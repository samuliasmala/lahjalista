import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { TitleText } from '~/components/TitleText';
import { SvgCheckMarkIcon } from '~/icons/check_mark_icon';
import { handleError } from '~/utils/handleError';
import SvgEyeOpen from '~/icons/eye_open';
import SvgEyeSlash from '~/icons/eye_slash';
import { formSchema } from '~/shared/zodSchemas';
import { Label } from '~/components/Label';
import { handleErrorToast } from '~/utils/handleToasts';
import { ErrorParagraph } from '~/components/ErrorParagraph';
import { useMutation } from '@tanstack/react-query';
import { QueryKeys } from '~/shared/types';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';
import { z } from 'zod';
import SvgInfoCircle from '~/icons/info_circle';
import { useIsFirefox } from '~/hooks/useIsFirefox';

type ErrorFieldNames = 'firstName' | 'lastName' | 'email' | 'password';

type ErrorTypes = Partial<Record<ErrorFieldNames, string | undefined>>;

type PasswordErrorNames =
  | 'length'
  | 'lowercaseLetter'
  | 'uppercaseLetter'
  | 'number'
  | 'specialCharacter';

type PasswordErrorTypes = Record<PasswordErrorNames, boolean>;
const EMPTY_PASSWORD_DATA: PasswordErrorTypes = {
  length: false,
  lowercaseLetter: false,
  number: false,
  specialCharacter: false,
  uppercaseLetter: false,
};

type FormData = z.infer<typeof formSchema>;

const EMPTY_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export default function Register() {
  const [isFirefox, setIsFirefox] = useState<boolean>(false);
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const [errors, setErrors] = useState<ErrorTypes>({});

  const passwordInfoModalRef = useRef<HTMLDivElement | null>(null);
  const isInitialClick = useRef<boolean>(false);

  const [showPasswordInfoModal, setShowPasswordInfoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] =
    useState<PasswordErrorTypes>(EMPTY_PASSWORD_DATA);

  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();

  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: QueryKeys.REGISTER,
    mutationFn: async (formData: FormData) =>
      await axios.post('/api/auth/register', formData),
    onSuccess: userCreatedSuccesfully,
  });

  useShowErrorToast(error);
  useIsFirefox(isFirefox, setIsFirefox);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // check if e.target is Element typed so it will work in .contains function
      if (e.target instanceof Element) {
        const isClickInModal = passwordInfoModalRef.current?.contains(e.target);
        if (
          showPasswordInfoModal &&
          !isClickInModal &&
          !isInitialClick.current
        ) {
          setShowPasswordInfoModal((prevValue) => !prevValue);
        }
      }
      // set initial click back to false, because initial click has been done
      if (isInitialClick.current) {
        isInitialClick.current = !isInitialClick.current;
      }
    }
    // if modal is open add the EventListener
    if (showPasswordInfoModal) {
      document.body.addEventListener('click', handleClick);
    }

    // remove the EventListener when modal is closed / unmounts
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [showPasswordInfoModal]);

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      const validatedForm = formSchema.safeParse(formData);
      if (validatedForm.success === false) {
        setErrors({
          firstName: validatedForm.error.format().firstName?._errors[0] || '',
          lastName: validatedForm.error.format().lastName?._errors[0] || '',
          email: validatedForm.error.format().email?._errors[0] || '',
          password: validatedForm.error.format().password?._errors[0] || '',
        });
        return;
      }
      setErrors({});
      await mutateAsync(validatedForm.data);
    } catch (e) {
      handleErrorToast(handleError(e));
    }
  }

  function findPasswordErrors(password: string) {
    setPasswordErrors({
      length: z.string().min(8).max(128).safeParse(password).success,
      number: z.string().regex(/[0-9]/).safeParse(password).success,
      lowercaseLetter: z.string().regex(/[a-z]/).safeParse(password).success,
      uppercaseLetter: z.string().regex(/[A-Z]/).safeParse(password).success,
      specialCharacter: z
        .string()
        .regex(/[^((0-9)|(a-z)|(A-Z)|\s)]/)
        .safeParse(password).success,
    });
  }

  function userCreatedSuccesfully() {
    setFormData(EMPTY_FORM_DATA);
    setIsUserCreated(true);
    setTimeout(() => {
      router.push('/').catch((e) => console.error(e));
    }, 1000);
  }

  const SvgEye = showPassword ? SvgEyeSlash : SvgEyeOpen;

  return (
    <main className="h-screen w-full max-w-full">
      <div className="h-screen w-screen">
        <div className="flex w-full justify-center">
          <div className="mt-14 flex w-full max-w-72 flex-col">
            <form onSubmit={(e) => void handleSubmit(e)}>
              <TitleText>Luo käyttäjätunnus</TitleText>
              <div className="ml-4 mr-4 mt-5 flex w-full flex-col">
                <Label>Etunimi</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      firstName: e.currentTarget.value,
                    });
                  }}
                  autoComplete="off"
                  type="text"
                  placeholder="Matti"
                  name="firstName"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.firstName} />

                <Label className="mt-5">Sukunimi</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      lastName: e.currentTarget.value,
                    });
                  }}
                  autoComplete="off"
                  type="text"
                  placeholder="Meikäläinen"
                  name="lastName"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.lastName} />

                <Label className="mt-5">Sähköpostiosoite</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.currentTarget.value });
                  }}
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="email"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.email} />

                <Label
                  className="mt-5"
                  onClick={(e) => {
                    // this prevents button's onClick function run when Label is clicked
                    e.preventDefault();
                  }}
                >
                  Salasana
                  <span className="absolute pl-1 pt-0.5">
                    {showPasswordInfoModal && (
                      // tämä pitää ns. "kasassa koko homman"

                      // toinen versio alanuolesta
                      // <span className="absolute left-14 top-36 mt-1 border-l-[20px] border-r-[20px] border-t-[20px] border-transparent border-t-black"></span>
                      <div className="absolute -left-16 -top-44">
                        <div
                          className="absolute w-max max-w-80 rounded-md border-4 border-lines bg-bgForms"
                          ref={passwordInfoModalRef}
                        >
                          <p className="pr-1 text-primaryText">
                            Salasanan pitää täyttää seuraavat vaatimukset:
                          </p>
                          <ul className="relative z-10 list-disc pb-1 pl-5 text-primaryText">
                            <li>
                              8-128 merkkiä:{' '}
                              {passwordErrors.length ? '✅' : '❌'}
                            </li>
                            <li>
                              vähintään yksi iso kirjain:{' '}
                              {passwordErrors.uppercaseLetter ? '✅' : '❌'}
                            </li>
                            <li>
                              vähintään yksi pieni kirjain:{' '}
                              {passwordErrors.lowercaseLetter ? '✅' : '❌'}
                            </li>
                            <li>
                              vähintään yksi numero:{' '}
                              {passwordErrors.number ? '✅' : '❌'}
                            </li>
                            <li>
                              vähintään yksi erikoismerkki:{' '}
                              {passwordErrors.specialCharacter ? '✅' : '❌'}
                            </li>
                          </ul>
                          <span
                            className={`absolute left-14 z-0 ml-1 ${isFirefox ? '-bottom-3.5' : 'top-32 mt-1.5'} h-7 w-7 rotate-45 border-4 border-b-inherit border-l-transparent border-r-inherit border-t-transparent bg-bgForms`}
                          ></span>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        isInitialClick.current = true;
                        setShowPasswordInfoModal((prevValue) => !prevValue);
                      }}
                    >
                      <SvgInfoCircle width={20} height={20} />
                    </button>
                  </span>
                </Label>

                <div className="flex rounded-md border-lines outline outline-1 has-[input:focus]:rounded has-[input:focus]:outline-2">
                  <Input
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.currentTarget.value,
                      });
                      findPasswordErrors(e.currentTarget.value);
                    }}
                    className={`w-full border-0 outline-none ${!showPassword && formData.password.length > 0 ? 'input-enlarge-password-mask-character-size' : ''}`}
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="************"
                    name="password"
                  />
                  <div className="flex items-center rounded-md has-[input:focus]:rounded has-[input:focus]:outline-2">
                    <SvgEye
                      className="h-8 w-8 cursor-pointer p-0 text-lines hover:stroke-primary"
                      onClick={() => {
                        setShowPassword((prevValue) => !prevValue);
                      }}
                    />
                  </div>
                </div>
                <ErrorParagraph errorText={errors.password} />

                <Button className="mt-8 select-none" disabled={isPending}>
                  Luo käyttäjätunnus
                  {isPending && <span className="loading-dots absolute" />}
                </Button>
                <p className="mt-3 select-none text-center text-xs text-gray-500">
                  Onko sinulla jo tunnus?{' '}
                  <Link
                    href={'/login'}
                    className={`cursor-pointer underline hover:text-blue-500`}
                  >
                    Kirjaudu sisään
                  </Link>
                </p>
              </div>
            </form>
          </div>
          {isUserCreated ? (
            <>
              <div className="fixed left-0 top-0 z-[98] h-full w-full bg-black opacity-20" />
              <div className="absolute left-[50%] top-[50%] z-[99] translate-x-[-50%] translate-y-[-50%]">
                <div
                  className={
                    'grid w-96 rounded-md border border-lines bg-bgForms'
                  }
                >
                  <SvgCheckMarkIcon
                    className="bg-green-300"
                    circleClassName="fill-green-500"
                    checkMarkClassName="fill-black"
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
