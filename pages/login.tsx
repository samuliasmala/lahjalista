import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Input } from '~/components/Input';
import { LoginAndSignOutButton } from '~/components/LoginAndSignOutButton';
import { TitleText } from '~/components/TitleText';
import { signIn } from 'next-auth/react';
const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const router = useRouter();

  function handleRegisterRedirect(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    e.preventDefault();
    router.push('/register');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await signIn('credentials', {
      email: email,
      password: password,
      callbackUrl: '/',
    });
  }

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div className="h-screen w-screen bg-no-repeat bg-cover bg-center">
        <div className="w-full flex justify-center">
          <div className="mt-5 flex justify-center flex-col">
            <form onSubmit={(e) => handleSubmit(e)}>
              <TitleText className="text-center">Kirjaudu sisään</TitleText>
              <div className="mt-5 flex flex-col">
                <label>Sähköposti</label>
                <Input
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="border border-black w-[19rem] "
                  autoComplete="off"
                  type="text"
                  placeholder="matti.meikalainen@email.com"
                  name="username"
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
                  name="username"
                />
              </div>
              <div className="flex mt-3">
                <label className="select-none cursor-pointer">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Muista minut
                </label>
              </div>
              <LoginAndSignOutButton type="submit" />
            </form>
            <p className="mt-6 text-xs text-gray-600 select-none">
              Sinulla ei ole vielä tunnuksia?{' '}
              <span
                className="underline cursor-pointer select-none hover:text-black"
                onClick={(e) => handleRegisterRedirect(e)}
              >
                Luo tunnus
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
