import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { TitleText } from '~/components/TitleText';

const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  const router = useRouter();

  return (
    <main className={`bg-white w-full max-w-full h-screen ${inter.className}`}>
      <div className="h-screen w-screen bg-no-repeat bg-cover bg-center">
        <div className="w-full flex justify-center">
          <div className="mt-5 flex justify-center flex-col">
            <form>
              <TitleText>Luo käyttäjätunnus</TitleText>
              <div className="mt-5 flex flex-col">
                <label>Sähköposti</label>
                <Input
                  className="border border-black w-[19rem] "
                  autoComplete="off"
                  type="text"
                  placeholder="mattimeikalainen@email.com"
                  name="username"
                  spellCheck="false"
                />
              </div>
              <div className="mt-5 flex flex-col">
                <label>Salasana</label>
                <Input
                  className="border border-black"
                  autoComplete="off"
                  type="password"
                  placeholder="************"
                  name="username"
                />
              </div>
              <Button>Kirjaudu</Button>
            </form>
            <p className="mt-6 text-xs text-gray-600">
              Onko sinulla jo tunnus?{' '}
              <span
                className="underline cursor-pointer"
                onClick={() => console.log('clicked')}
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
