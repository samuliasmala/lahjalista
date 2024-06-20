import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, HTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Modal } from '~/components/Modal';
import { TitleText } from '~/components/TitleText';
import { SvgCheckMarkIcon } from '~/icons/CheckMarkIcon';
import { handleAuthErrors } from '~/utils/handleError';
import SvgEyeOpen from '~/icons/eye_open';
import SvgEyeSlash from '~/icons/eye_slash';
import { formSchema } from '~/shared/zodSchemas';
import { Label } from '~/components/Label';

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

  const [registerError, setRegisterError] = useState('');

  const [errors, setErrors] = useState<ErrorTypes>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
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
      await axios.post('/api/auth/register', validatedForm.data);
      userCreatedSuccesfully();
    } catch (e) {
      const errorText = handleAuthErrors(e);
      setRegisterError(errorText);
    }
  }

  function userCreatedSuccesfully() {
    setFormData(EMPTY_FORM_DATA);
    setRegisterError('');
    setIsUserCreated(true);
    setTimeout(() => {
      router.push('/').catch((e) => console.error(e));
    }, 1000);
  }

  const SvgEye = showPassword ? SvgEyeSlash : SvgEyeOpen;

  return (
    <main className="w-full max-w-full h-screen">
      <div className="h-screen w-screen">
        <div className="w-full flex justify-center">
          <div className="pt-5 flex flex-col">
            {registerError.length > 0 ? (
              <div className="max-w-sm text-center bg-red-100 border border-red-400 text-red-700 p-3 rounded [overflow-wrap:anywhere]">
                {registerError}
              </div>
            ) : null}
            <form onSubmit={(e) => void handleRegister(e)}>
              <TitleText className="text-center">Luo käyttäjätunnus</TitleText>
              <div className="pt-5 pl-4 pr-4 flex flex-col max-w-80">
                <Label>Etunimi</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      firstName: e.currentTarget.value,
                    });
                  }}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Matti"
                  name="firstName"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.firstName} />

                <Label className="pt-5">Sukunimi</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      lastName: e.currentTarget.value,
                    });
                  }}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Meikäläinen"
                  name="lastName"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.lastName} />

                <Label className="pt-5">Sähköposti</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.currentTarget.value });
                  }}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="email"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.email} />

                <Label className="pt-5">Salasana</Label>
                <div className="flex rounded-md outline outline-1 border-black hover:bg-gray-100 has-[input:focus]:outline-2 has-[input:focus]:rounded group/password">
                  <Input
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.currentTarget.value,
                      });
                    }}
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
                <ErrorParagraph errorText={errors.password} />

                <Button className="select-none">Luo käyttäjätunnus</Button>
                <p className="select-none pt-6 text-xs text-gray-600">
                  Onko sinulla jo tunnus?{' '}
                  <Link
                    href={'/login'}
                    className="underline cursor-pointer hover:text-blue-500"
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
    <p className={twMerge('text-red-600 max-w-xs', className)} {...rest}>
      {errorText}
    </p>
  );
}
