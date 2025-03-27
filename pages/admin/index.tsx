import { useState } from 'react';
import { Button } from '~/components/Button';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import { TitleBar } from '~/components/TitleBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIsAdmin } from '~/hooks/useIsAdmin';
import { useShowErrorToast } from '~/hooks/useShowErrorToast';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showUserWindow, setShowUserWindow] = useState(false);

  const router = useRouter();

  useIsAdmin(user, router);
  useShowErrorToast(null);

  return (
    <main className="h-screen w-full max-w-full">
      <TitleBar
        setShowUserWindow={setShowUserWindow}
        showUserWindow={showUserWindow}
        userDetails={user}
      />
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-72">
          <AdminPageButtons href="/admin/feedback" buttonText="Palautteet" />
        </div>
      </div>
    </main>
  );
}

function AdminPageButtons({
  href,
  buttonText,
}: {
  href: string;
  buttonText: string;
}) {
  return (
    <Link href={href}>
      <Button>{buttonText}</Button>
    </Link>
  );
}
