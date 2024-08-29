import { Inter } from 'next/font/google';
import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { isPhoneUser } from '~/utils/isPhoneUser';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

// CHECK THIS, onko tässä tiedostossa mitään järkeä?

export default function App({ Component, pageProps }: AppProps) {
  const [isUserPhoneUser, setIsUserPhoneUser] = useState(false);
  useEffect(() => {
    if (window) {
      setIsUserPhoneUser(isPhoneUser(window));
    }
  }, []);

  return (
    <div className={`${inter.className}`}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, interactive-widget=resizes-visual"
        />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        limit={isUserPhoneUser ? 1 : 3}
      />
      <Component {...pageProps} />
    </div>
  );
}
