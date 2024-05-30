import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';

export default function Logout() {
  return (
    <main className="bg-orange-50 w-full max-w-full h-screen ">
      <div className="h-screen w-screen flex flex-col items-center">
        <div className="max-w-80">
          <div className="pt-16 flex items-center justify-center select-none">
            <Image
              alt="logo"
              src="/images/logo_no_text.png"
              className="w-32 max-w-max"
            />
            <p className="absolute pb-5 font-bold text-sm">LAHJAIDEA</p>
            <p className="absolute pt-5 text-gray-400">LISTA</p>
          </div>
          <div className="pt-10 flex flex-col items-center">
            <TitleText className="font-bold">Näkemiin!</TitleText>
            <p className="text-center text-sm [overflow-wrap:anywhere] pt-10 text-gray-600">
              Oli ilo auttaa sinua lahjaideoiden kanssa, nähdään pian uudelleen!
            </p>
          </div>
          <div className="pt-20">
            <form className="flex flex-col text-center">
              <label className="text-start">Palaute</label>
              <textarea className="border border-black h-32 pl-1 pt-1" />
              <Button className="p-2" type="submit">
                Lähetä
              </Button>
              <p className="select-none pt-6 text-xs text-gray-600">
                Saitko uuden idean?{' '}
                <Link
                  href={'/login'}
                  className="underline cursor-pointer hover:text-blue-500"
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
