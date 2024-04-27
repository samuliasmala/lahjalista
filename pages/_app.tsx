import { Inter } from 'next/font/google';
import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className}`}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, interactive-widget=overlays-content"
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
