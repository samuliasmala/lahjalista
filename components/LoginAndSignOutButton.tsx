import { ButtonHTMLAttributes } from 'react';
import { Button } from './Button';
import { signIn, signOut, useSession } from 'next-auth/react';

export function LoginAndSignOutButton({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p className="text-3xl">Signed in as {session.user?.email}</p>
        <Button onClick={() => signOut()} className={className} {...rest}>
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <p className="text-3xl">Not signed in</p>
      <Button onClick={() => signIn()} className={className} {...rest}>
        Sign in
      </Button>
    </>
  );
}
