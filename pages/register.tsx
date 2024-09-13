import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, HTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Modal } from '~/components/Modal';
import { TitleText } from '~/components/TitleText';
import { SvgCheckMarkIcon } from '~/icons/check_mark_icon';
import { handleAuthErrors } from '~/utils/handleError';
import SvgEyeOpen from '~/icons/eye_open';
import SvgEyeSlash from '~/icons/eye_slash';
import { formSchema } from '~/shared/zodSchemas';
import { Label } from '~/components/Label';
import { toast } from 'react-toastify';

type ErrorFieldNames = 'firstName' | 'lastName' | 'email' | 'password';

type ErrorTypes = Partial<Record<ErrorFieldNames, string | undefined>>;

const EMPTY_FORM_DATA = {
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

  async function handleRegister(e: FormEvent) {
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
      await axios.post('/api/auth/register', validatedForm.data);
      userCreatedSuccesfully();
    } catch (e) {
      toast(handleAuthErrors(e), { type: 'error' });
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
            <form onSubmit={(e) => void handleRegister(e)}>
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

                <Label className="mt-5">Salasana</Label>
                <div className="flex rounded-md border-lines outline outline-1 has-[input:focus]:rounded has-[input:focus]:outline-2 ">
                  <Input
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.currentTarget.value,
                      });
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

                <Button className="mt-8 select-none">Luo käyttäjätunnus</Button>
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
            <Modal>
              <SvgCheckMarkIcon
                className="bg-green-300"
                circleClassName="fill-green-500"
                checkMarkClassName="fill-black-500"
              />
            </Modal>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ErrorParagraph({
  className,
  errorText,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { errorText: string | undefined }) {
  if (typeof errorText !== 'string' || errorText.length <= 0) return null;
  return (
    <p className={twMerge('max-w-xs text-red-600', className)} {...rest}>
      {errorText}
    </p>
  );
}
