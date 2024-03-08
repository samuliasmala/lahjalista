import { useSession } from 'next-auth/react';
import { HTMLAttributes } from 'react';

export function SessionComponent({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const useSessionVariable = useSession();
  console.log(useSessionVariable);
  return (
    <div>
      {useSessionVariable.status === 'authenticated' &&
        useSessionVariable.data !== null && (
          <>
            <p>{useSessionVariable.data.user.email}</p>
            <p>{useSessionVariable.data.user.id}</p>
          </>
        )}
    </div>
  );
}
