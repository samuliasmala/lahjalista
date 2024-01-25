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

    const isCorrectEmail = checkIsEmailCorrect();
    if (isCorrectEmail === null) {
      return setEmailError(true);
    }

    // could be used without splittedEmail variable, but the finalEmail variable would get extremely long and hard to read
    const splittedEmail = isCorrectEmail[0].split('@');
    const finalEmail = `${splittedEmail[0].replace(/[.]/g, '')}@${
      splittedEmail[1]
    }`;
    console.log(finalEmail);
  }

  function checkIsEmailCorrect() {
    // this should check with regex that there cannot be multiple dots etc
    const regexPattern =
      /^[^\s!@#$%^&*,:;¨|äöå]+@[^\s!@#$%^&*,:;¨|äöå0-9.]+\.[^\s!@#$%^&*,:;.¨|äöå0-9]+[a-z]*$/g;
    // /^[^\s@]+@[^\s@]+\.[^\s@]+\.+$/;
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
