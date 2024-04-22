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
import { handleRegisterError } from '~/utils/handleError';
import { emailRegex, passwordRegex } from '~/shared/regexPatterns';
import SvgEyeOpen from '~/icons/eye_open';
import SvgEyeSlash from '~/icons/eye_slash';
import { z } from 'zod';

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
      } as CreateUser);
      userCreatedSuccesfully();
    } catch (e) {
      const errorText = handleRegisterError(e);
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
    const zodCheck = z.string().min(1).max(128).safeParse(firstName);
    if (!zodCheck.success) {
      setErrors((prevValue) => ({
        ...prevValue,
        firstName: 'Etunimi on pakollinen',
      }));
      return false;
    }
    return true;
  }

  function isLastNameValid(): boolean {
    const zodCheck = z.string().min(1).max(128).safeParse(lastName);
    if (!zodCheck.success) {
      setErrors((prevValue) => ({
        ...prevValue,
        lastName: 'Sukunimi on pakollinen',
      }));
      return false;
    }
    return true;
  }

  function isEmailValid(): boolean {
    // Olisiko parempi laittaa suoraan .safeParse(email.toLowerCase())-funktioon?
    const lowerCasedEmail = email.toLowerCase();
    const zodCheck = z
      .string()
      .min(1, { message: 'lengthError' })
      .max(128)
      .regex(emailRegex, { message: 'regexError' })
      .safeParse(lowerCasedEmail);

    if (!zodCheck.success) {
      const isLengthErrorFound = zodCheck.error
        .format()
        ._errors.includes('lengthError');

      if (isLengthErrorFound) {
        setErrors((prevValue) => ({
          ...prevValue,
          email: 'Sähköposti on pakollinen',
        }));
        return false;
      }

      const isRegexErrorFound = zodCheck.error
        .format()
        ._errors.includes('regexError');

      if (isRegexErrorFound) {
        setErrors((prevValue) => ({
          ...prevValue,
          email: 'Virheellinen sähköposti',
        }));

        return false;
      }
    }

    return true;
  }

  function isPasswordValid(): boolean {
    const zodCheck = z
      .string()
      .min(1, { message: 'lengthError' })
      .max(128)
      .regex(passwordRegex, { message: 'regexError' })
      .safeParse(password);

    if (!zodCheck.success) {
      const isLengthErrorFound = zodCheck.error
        .format()
        ._errors.includes('lengthError');

      if (isLengthErrorFound) {
        setErrors((prevValue) => ({
          ...prevValue,
          password: 'Salasana on pakollinen',
        }));
        return false;
      }

      const isRegexErrorFound = zodCheck.error
        .format()
        ._errors.includes('regexError');

      if (isRegexErrorFound) {
        setErrors((prevValue) => ({
          ...prevValue,
          password:
            'Salasanan täytyy olla vähintään 8 merkkiä pitkä, maksimissaan 128 merkkiä pitkä, sekä sisältää vähintään yksi iso kirjain, yksi pieni kirjain, yksi numero ja yksi erikoismerkki!',
        }));
        return false;
      }
    }

    return true;
  }

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
                    {showPassword ? (
                      <SvgEyeSlash
                        className="w-8 h-8 cursor-pointer p-0 hover:stroke-yellow-600 "
                        onClick={() => {
                          setShowPassword((prevValue) => !prevValue);
                        }}
                      />
                    ) : (
                      <SvgEyeOpen
                        className="w-8 h-8 cursor-pointer p-0 hover:stroke-yellow-600 "
                        onClick={() => {
                          setShowPassword((prevValue) => !prevValue);
                        }}
                      />
                    )}
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
