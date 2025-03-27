import { NextRouter } from 'next/router';
import { useEffect } from 'react';
import { User } from '~/shared/types';

/**
 * This useEffect checks if the User has the ADMIN role
 *
 * if the User does not have the ADMIN role, they will be redirected back to main page
 *
 * else the User can access the page
 * @param user User
 * @param router NextRouter
 */
export function useIsAdmin(
  user: User,
  router: NextRouter,
  callback?: () => void,
) {
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/').catch((e) => console.error(e));
      return;
    }
    if (callback) callback();
  }, [user]);
}
