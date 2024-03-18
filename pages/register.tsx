import axios from 'axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { FormEvent, HTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { TitleText } from '~/components/TitleText';
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

  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsEmailError(false);
    if (isEmailValid() === null) {
      return setIsEmailError(true);
    }
    try {
      console.log('Handling registering!');
    } catch (e) {
      console.error(e);
    }
  }

  function isFirstNameValid(): boolean {
    const checkedFirstName = firstName.match(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
    );

    if (!checkedFirstName) {
      return false;
    }
    return true;
  }

  function isLastNameValid(): boolean {
    const checkedLastName = lastName.match(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
    );

    if (!checkedLastName) {
      return false;
    }
    return true;
  }

  function isEmailValid(): boolean {
    // this should check with regex that there cannot be multiple dots etc
    const checkedEmailAddress = email
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

    if (!checkedEmailAddress) {
      setIsEmailError(true);
      setEmailErrorText('Virheellinen sähköposti!');
      return false;
    }

    return true;
  }

  function isPasswordValid(): boolean {
    const checkedPassword = password.match(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    );

    if (!checkedPassword) {
      setIsPasswordError(true);
      setPasswordErrorText(
        'Salasanan täytyy sisältää vähintään yksi kirjain ja yksi numero',
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
            <form onSubmit={(e) => handleRegister(e)}>
              <TitleText className="text-center">Luo käyttäjätunnus</TitleText>
              <div className="pt-5 pl-4 pr-4 flex flex-col">
                <label>Etunimi</label>
                <Input
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
                    className="underline cursor-pointer"
                    onClick={() => {
                      router.push('/login');
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
    <p className={twMerge('text-red-600 mt-2 max-w-xs', className)} {...rest}>
      {children}
    </p>
  );
}
