import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
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
import { Spinner } from '~/components/Spinner';

type ErrorFieldNames = 'firstName' | 'lastName' | 'email' | 'password';

type ErrorTypes = Partial<Record<ErrorFieldNames, string | undefined>>;

type FormData = z.infer<typeof formSchema>;

const EMPTY_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export default function Register() {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const [errors, setErrors] = useState<ErrorTypes>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();

  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: QueryKeys.REGISTER,
    mutationFn: async (formData: FormData) =>
      await axios.post('/api/auth/register', formData),
    onSuccess: userCreatedSuccesfully,
  });

  useShowErrorToast(error);

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
              <div className="mt-5 mr-4 ml-4 flex w-full flex-col">
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

                <Label className="mt-5">Salasana</Label>
                <div className="border-lines flex rounded-md outline-1 has-[input:focus]:rounded-sm has-[input:focus]:outline-2">
                  <Input
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.currentTarget.value,
                      });
                    }}
                    className={`w-full border-0 outline-hidden ${!showPassword && formData.password.length > 0 ? 'input-enlarge-password-mask-character-size' : ''}`}
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="************"
                    name="password"
                  />
                  <div className="flex items-center rounded-md has-[input:focus]:rounded has-[input:focus]:outline-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword((prevValue) => !prevValue);
                      }}
                    >
                      <SvgEye className="text-lines h-8 w-8 cursor-pointer p-0" />
                    </button>
                  </div>
                </div>
                <ErrorParagraph errorText={errors.password} />

                <Button className="mt-8 select-none" disabled={isPending}>
                  Luo käyttäjätunnus
                  {isPending && <Spinner />}
                </Button>
                <p className="mt-3 text-center text-xs text-gray-500 select-none">
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
              <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-20" />
              <div className="absolute top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
                <div
                  className={
                    'border-lines bg-bg-forms grid w-96 rounded-md border'
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
