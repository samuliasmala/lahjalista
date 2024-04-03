import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, HTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Modal } from '~/components/Modal';
import { TitleText } from '~/components/TitleText';
import { SvgCheckMarkIcon } from '~/icons/CheckMarkIcon';
import { createUser } from '~/utils/apiRequests';
import { handleUserError } from '~/utils/handleError';
import { emailRegex, passwordRegex } from '~/utils/regexPatterns';

type Errors = {
  firstNameErrorText: string;
  lastNameErrorText: string;
  emailErrorText: string;
  passwordErrorText: string;
};

const NO_ERRORS = {
  firstNameErrorText: '',
  lastNameErrorText: '',
  emailErrorText: '',
  passwordErrorText: '',
} as const;

export default function Login() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Errors>(NO_ERRORS);

  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!isAllFieldsValid()) return;
      await createUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      });
      userCreatedSuccesfully();
    } catch (e) {
      handleUserError(e);
    }
  }

  function userCreatedSuccesfully() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setIsUserCreated(true);
    setTimeout(() => {
      router.push('/').catch((e) => console.error(e));
    }, 1000);
  }

  function clearAllErrors() {
    setErrors(NO_ERRORS);
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
        firstNameErrorText: 'Etunimi on pakollinen',
      }));
      return false;
    }
    return true;
  }

  function isLastNameValid(): boolean {
    if (lastName.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        lastNameErrorText: 'Sukunimi on pakollinen',
      }));
      return false;
    }
    return true;
  }

  function isEmailValid(): boolean {
    if (email.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        emailErrorText: 'Sähköposti on pakollinen',
      }));
      return false;
    }
    // this should check with regex that there cannot be multiple dots etc
    const checkedEmailAddress = email.toLowerCase().match(emailRegex);

    if (!checkedEmailAddress) {
      setErrors((prevValue) => ({
        ...prevValue,
        emailErrorText: 'Virheellinen sähköposti',
      }));
      return false;
    }

    return true;
  }

  function isPasswordValid(): boolean {
    if (password.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        passwordErrorText: 'Salasana on pakollinen',
      }));
      return false;
    }
    // TLDR: 8 merkkiä pitkä, vähintään 1 numero, 1 pieni ja iso kirjain sekä yksi erikoismerkki
    const checkedPassword = password.match(passwordRegex);
    if (!checkedPassword) {
      setErrors((prevValue) => ({
        ...prevValue,
        passwordErrorText:
          'Salasanan täytyy olla vähintään 8 merkkiä pitkä, maksimissaan 128 merkkiä pitkä, sekä sisältää vähintään yksi iso kirjain, yksi pieni kirjain, yksi numero ja yksi erikoismerkki!',
      }));
      return false;
    }

    return true;
  }

  return (
    <main className="bg-white w-full max-w-full h-screen">
      <div className="h-screen w-screen">
        <div className="w-full flex justify-center">
          <div className="pt-5 flex flex-col">
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
                <ErrorParagraph errorText={errors.firstNameErrorText} />

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
                <ErrorParagraph errorText={errors.lastNameErrorText} />

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
                <ErrorParagraph errorText={errors.emailErrorText} />

                <label className="pt-5">Salasana</label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  className="border border-black"
                  autoComplete="off"
                  type="password"
                  placeholder="************"
                  name="password"
                />
                <ErrorParagraph errorText={errors.passwordErrorText} />

                <Button>Luo käyttäjätunnus</Button>
                <p className="pt-6 text-xs text-gray-600">
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
  children,
  errorText,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { errorText: string }) {
  if (errorText.length <= 0) return null;
  return (
    <p className={twMerge('text-red-600 max-w-xs', className)} {...rest}>
      {errorText}
    </p>
  );
}
