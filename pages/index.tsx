import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={`flex justify-center ${inter.className}`}>
      <div className="bg-white w-full max-w-xl h-screen">
        Tähän tulee lahjalista
      </div>
    </main>
  );
}
