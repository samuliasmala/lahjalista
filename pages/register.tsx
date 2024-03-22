import { Inter } from 'next/font/google';
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
import { emailRegex, passwordRegex } from '~/shared/regexPatterns';

const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  const [firstName, setFirstName] = useState('');
  const [firstNameErrorText, setFirstNameErrorText] = useState('');
  const [isFirstNameError, setIsFirstNameError] = useState(false);

  const [lastName, setLastName] = useState('');
  const [lastNameErrorText, setLastNameErrorText] = useState('');
  const [isLastNameError, setIsLastNameError] = useState(false);

  const [email, setEmail] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!isAllFieldsValid()) return;
      console.log('Handling registering!');
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
    setIsFirstNameError(false);
    setIsLastNameError(false);
    setIsEmailError(false);
    setIsPasswordError(false);
  }

  function isAllFieldsValid(): boolean {
    clearAllErrors();
    let errorFound = false;
    if (!isFirstNameValid()) errorFound = true;
    if (!isLastNameValid()) errorFound = true;
    if (!isEmailValid()) errorFound = true;
    if (!isPasswordValid()) errorFound = true;

    if (errorFound) {
      return false;
    }
    return true;
  }

  function isFirstNameValid(): boolean {
    if (firstName.length <= 0) {
      setIsFirstNameError(true);
      setFirstNameErrorText('Etunimi on pakollinen!');
      return false;
    }
    return true;
  }

  function isLastNameValid(): boolean {
    if (lastName.length <= 0) {
      setIsLastNameError(true);
      setLastNameErrorText('Sukunimi on pakollinen!');
      return false;
    }
    return true;
  }

  function isEmailValid(): boolean {
    if (email.length <= 0) {
      setIsEmailError(true);
      setEmailErrorText('Sähköposti on pakollinen!');
      return false;
    }
    // this should check with regex that there cannot be multiple dots etc
    const checkedEmailAddress = email.toLowerCase().match(emailRegex);

    if (!checkedEmailAddress) {
      setIsEmailError(true);
      setEmailErrorText('Virheellinen sähköposti!');
      return false;
    }

    return true;
  }

  function isPasswordValid(): boolean {
    if (password.length <= 0) {
      setIsPasswordError(true);
      setPasswordErrorText('Salasana on pakollinen!');
      return false;
    }
    // TLDR: 8 merkkiä pitkä, vähintään 1 numero, 1 pieni ja iso kirjain sekä yksi erikoismerkki
    const checkedPassword = password.match(passwordRegex);
    if (!checkedPassword) {
      setIsPasswordError(true);
      setPasswordErrorText(
        'Salasanan täytyy olla vähintään 8 merkkiä pitkä, sekä sisältää vähintään yksi iso kirjain, yksi pieni kirjain, yksi numero ja yksi erikoismerkki',
      );
      return false;
    }

    return true;
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
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
                {isFirstNameError ? (
                  <ErrorParagraph>{firstNameErrorText}</ErrorParagraph>
                ) : null}

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
                {isLastNameError ? (
                  <ErrorParagraph>{lastNameErrorText}</ErrorParagraph>
                ) : null}

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
                {isEmailError ? (
                  <ErrorParagraph>{emailErrorText}</ErrorParagraph>
                ) : null}

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
                {isPasswordError ? (
                  <ErrorParagraph>{passwordErrorText}</ErrorParagraph>
                ) : null}

                <Button>Luo käyttäjätunnus</Button>
                <p className="pt-6 text-xs text-gray-600">
                  Onko sinulla jo tunnus?{' '}
                  <span
                    className="underline cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      router.push('/login').catch((e) => console.error(e));
                    }}
                  >
                    Kirjaudu sisään
                  </span>
                </p>
              </div>
            </form>
            <TitleText className="mt-5 p-3 border-4 border-red-600">
              Älä käytä oikeita sähköposteja!
            </TitleText>
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
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge('text-red-600 max-w-xs', className)} {...rest}>
      {children}
    </p>
  );
}
