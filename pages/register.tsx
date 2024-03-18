import axios from 'axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { TitleText } from '~/components/TitleText';
const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const router = useRouter();

  function handleLoginRedirect(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    e.preventDefault();
    router.push('/login');
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(false);

    if (checkIsEmailCorrect() === null) {
      return setEmailError(true);
    }
    try {
      console.log('Handling registering!');
    } catch (e) {
      console.error(e);
    }
  }

  function checkIsEmailCorrect() {
    // this should check with regex that there cannot be multiple dots etc
    const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.toLowerCase().match(regexPattern);
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div className="h-screen w-screen">
        <div className="w-full flex justify-center">
          <div className="mt-5 flex flex-col">
            <form onSubmit={(e) => handleRegister(e)}>
              <TitleText className="text-center">Luo käyttäjätunnus</TitleText>
              <div className="mt-5 flex flex-col">
                <label>Etunimi</label>
                <Input
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Matti"
                  name="firstName"
                  spellCheck="false"
                />
                <label>Sukunimi</label>
                <Input
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Meikäläinen"
                  name="lastName"
                  spellCheck="false"
                />
                <label>Sähköposti</label>
                <Input
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="email"
                  spellCheck="false"
                />
                {emailError ? (
                  <p className="text-red-600 mt-2">
                    Sähköpostiosoite on virheellinen
                  </p>
                ) : null}
              </div>
              <div className="mt-5 flex flex-col">
                <label>Salasana</label>
                <Input
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  className="border border-black"
                  autoComplete="off"
                  type="password"
                  placeholder="************"
                  name="password"
                />
              </div>
              <Button>Luo käyttäjätunnus</Button>
            </form>
            <p className="mt-6 text-xs text-gray-600">
              Onko sinulla jo tunnus?{' '}
              <span
                className="underline cursor-pointer"
                onClick={(e) => handleLoginRedirect(e)}
              >
                Kirjaudu sisään
              </span>
            </p>
            <TitleText className="mt-5 p-3 border-4 border-red-600">
              Älä käytä oikeita sähköposteja!
            </TitleText>
          </div>
        </div>
      </div>
    </main>
  );
}
