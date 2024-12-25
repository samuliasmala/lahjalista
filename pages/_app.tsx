// eslint-disable-next-line n/no-extraneous-import
import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Bounce, ToastContainer } from 'react-toastify';
// eslint-disable-next-line n/no-extraneous-import
import 'react-toastify/ReactToastify.css';
import { useEffect, useState } from 'react';
import { jost } from '~/utils/fonts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [isPhoneUser, setIsPhoneUser] = useState(false);
  useEffect(() => {
    setIsPhoneUser(window.screen.width < 768 || window.screen.height < 768);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`${jost.className}`}>
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
          limit={isPhoneUser ? 1 : 3}
        />
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
