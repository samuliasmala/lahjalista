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
import type { CreateUser } from '~/shared/types';
import { handleAuthErrors } from '~/utils/handleError';
import { emailRegex, passwordRegex } from '~/shared/regexPatterns';
import SvgEyeOpen from '~/icons/eye_open';
import SvgEyeSlash from '~/icons/eye_slash';

type ErrorFieldNames = 'firstName' | 'lastName' | 'email' | 'password';

type ErrorTypes = Partial<Record<ErrorFieldNames, string | undefined>>;

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerError, setRegisterError] = useState('');

  const [errors, setErrors] = useState<ErrorTypes>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!isAllFieldsValid()) return;
      await axios.post('/api/auth/register', {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      });
      userCreatedSuccesfully();
    } catch (e) {
      const errorText = handleAuthErrors(e);
      setRegisterError(errorText);
    }
  }

  function userCreatedSuccesfully() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRegisterError('');
    setIsUserCreated(true);
    setTimeout(() => {
      router.push('/').catch((e) => console.error(e));
    }, 1000);
  }

  function clearAllErrors() {
    setErrors({});
  }

  function isAllFieldsValid(): boolean {
    clearAllErrors();
    let errorFound = false;
    if (!isFirstNameValid()) errorFound = true;
    if (!isLastNameValid()) errorFound = true;
    if (!isEmailValid()) errorFound = true;
    if (!isPasswordValid()) errorFound = true;

    return !errorFound;
  }

  function isFirstNameValid(): boolean {
    if (firstName.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        firstName: 'Etunimi on pakollinen',
      }));
      return false;
    }
    return true;
  }

  function isLastNameValid(): boolean {
    if (lastName.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        lastName: 'Sukunimi on pakollinen',
      }));
      return false;
    }
    return true;
  }

  function isEmailValid(): boolean {
    if (email.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        email: 'Sähköposti on pakollinen',
      }));
      return false;
    }
    // this should check with regex that there cannot be multiple dots etc
    const checkedEmailAddress = email.toLowerCase().match(emailRegex);

    if (!checkedEmailAddress) {
      setErrors((prevValue) => ({
        ...prevValue,
        email: 'Virheellinen sähköposti',
      }));
      return false;
    }

    return true;
  }

  function isPasswordValid(): boolean {
    if (password.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        password: 'Salasana on pakollinen',
      }));
      return false;
    }
    // TLDR: 8 merkkiä pitkä, vähintään 1 numero, 1 pieni ja iso kirjain sekä yksi erikoismerkki
    const checkedPassword = password.match(passwordRegex);
    if (!checkedPassword) {
      setErrors((prevValue) => ({
        ...prevValue,
        password:
          'Salasanan täytyy olla vähintään 8 merkkiä pitkä, maksimissaan 128 merkkiä pitkä, sekä sisältää vähintään yksi iso kirjain, yksi pieni kirjain, yksi numero ja yksi erikoismerkki!',
      }));
      return false;
    }

    return true;
  }

  const SvgEye = showPassword ? SvgEyeSlash : SvgEyeOpen;

  return (
    <main className="bg-white w-full max-w-full h-screen">
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
              <div className="pt-5 pl-4 pr-4 flex flex-col">
                <label>Etunimi</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Matti"
                  name="firstName"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.firstName} />

                <label className="pt-5">Sukunimi</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Meikäläinen"
                  name="lastName"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.lastName} />

                <label className="pt-5">Sähköposti</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="email"
                  spellCheck="false"
                />
                <ErrorParagraph errorText={errors.email} />

                <label className="pt-5">Salasana</label>
                <div className="flex outline outline-1 border-black hover:bg-gray-100 has-[input:focus]:outline has-[input:focus]:outline-2 has-[input:focus]:rounded">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className="pl-1 pt-3 pb-3 border-0 outline-none group-hover/password:bg-gray-100"
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="************"
                    name="password"
                  />
                  <div className="group-hover/password:bg-gray-100 hover:bg-white flex items-center ">
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
