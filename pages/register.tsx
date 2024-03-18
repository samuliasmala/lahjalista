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
  const [emailErrorText, setEmailErrorText] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

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

  function isEmailValid() {
    // this should check with regex that there cannot be multiple dots etc
    const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.toLowerCase().match(regexPattern);
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
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Matti"
                  name="firstName"
                  spellCheck="false"
                />
                <label className="pt-5">Sukunimi</label>
                <Input
                  className="border border-black"
                  autoComplete="off"
                  type="text"
                  placeholder="Meikäläinen"
                  name="lastName"
                  spellCheck="false"
                />
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
                  <p className="text-red-600 mt-2">{emailErrorText}</p>
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