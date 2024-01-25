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

  const router = useRouter();

  function handleLoginRedirect(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    e.preventDefault();
    router.push('/login');
  }

  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(email);
    console.log(password);
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
