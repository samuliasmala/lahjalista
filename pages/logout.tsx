import Link from 'next/link';
import { Button } from '~/components/Button';
import { Logo } from '~/components/Logo';
import { TitleText } from '~/components/TitleText';

export default function Logout() {
  return (
    <main className="h-screen w-full max-w-full ">
      <div className="flex h-screen w-screen flex-col items-center">
        <div className="max-w-80">
          <Logo />
          <div className="flex flex-col items-center pt-10">
            <TitleText className="font-bold">Näkemiin!</TitleText>
            <p className="pt-10 text-center text-sm text-gray-600 [overflow-wrap:anywhere]">
              Oli ilo auttaa sinua lahjaideoiden kanssa, nähdään pian uudelleen!
            </p>
          </div>
          <div className="pt-20">
            <form className="flex flex-col text-center">
              <label className="text-start">Palaute</label>
              <textarea className="h-32 border border-black pl-1 pt-1" />
              <Button className="p-2" type="submit">
                Lähetä
              </Button>
              <p className="select-none pt-6 text-xs text-gray-600">
                Saitko uuden idean?{' '}
                <Link
                  href={'/login'}
                  className="cursor-pointer underline hover:text-blue-500"
                >
                  Kirjaudu uudelleen
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
