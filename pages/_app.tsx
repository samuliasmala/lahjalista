import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, interactive-widget=resizes-content"
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
