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

  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(false);

    if (checkIsEmailCorrect() === null) {
      return setEmailError(true);
    }
  }

  function checkIsEmailCorrect() {
    // this should check with regex that there cannot be multiple dots etc
    const regexPattern =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    //const regexPattern = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]+$/; // AI-version
    // /^[^\s!@#$%^&*,:;¨|äöå]+@[^\s!@#$%^&*,:;¨|äöå0-9.]+\.[^\s!@#$%^&*,:;.¨|äöå0-9]+[a-z]*$/g; // my own version
    // /^[^\s@]+@[^\s@]+\.[^\s@]+\.+$/; // found from internet and used as a base
    return email.toLowerCase().match(regexPattern);
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div className="h-screen w-screen bg-no-repeat bg-cover bg-center">
        <div className="w-full flex justify-center">
          <div className="mt-5 flex justify-center flex-col">
            <form onSubmit={(e) => handleRegister(e)}>
              <TitleText className="text-center">Luo käyttäjätunnus</TitleText>
              <div className="mt-5 flex flex-col">
                <label>Sähköposti</label>
                <Input
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="border border-black w-[19rem] "
                  autoComplete="off"
                  type="text"
                  placeholder="mattimeikalainen@email.com"
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
                className="underline cursor-pointer select-none"
                onClick={(e) => handleLoginRedirect(e)}
              >
                Kirjaudu sisään
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
