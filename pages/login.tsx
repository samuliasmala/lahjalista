import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { TitleText } from '~/components/TitleText';

export default function Login() {
  const [email, setEmail] = useState('john.doe@doemail.com');
  const [password, setPassword] = useState('1');
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    return await router.push('/');
  }

  return (
    <main className="bg-white w-full max-w-full h-screen">
      <div className="h-screen w-screen bg-no-repeat bg-cover bg-center">
        {isError ? (
          <div className="pt-3 flex justify-center ">
            <div className="max-w-sm text-center bg-red-100 border border-red-400 text-red-700 p-3 rounded [overflow-wrap:anywhere]">
              {errorText}
            </div>
          </div>
        ) : null}
        <div className="w-full flex justify-center">
          <div className="mt-5 flex flex-col">
            <form onSubmit={(e) => void handleSubmit(e)}>
              <TitleText className="text-center">Kirjaudu sisään</TitleText>
              <div className="mt-5 flex flex-col">
                <label>Sähköposti</label>
                <Input
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  value={email}
                  className="border border-black pl-8 pr-8"
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
                  value={password}
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
              <Button type="submit">Kirjaudu</Button>
            </form>
            <p className="mt-6 text-xs text-gray-600">
              Sinulla ei ole vielä tunnuksia?{' '}
              <Link
                href={'/register'}
                className="underline cursor-pointer hover:text-blue-500"
              >
                Luo tunnus
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
