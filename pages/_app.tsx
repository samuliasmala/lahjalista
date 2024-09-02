import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { jost } from '~/utils/fonts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${jost.className}`}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, interactive-widget=resizes-visual"
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
