import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { lucia, validateRequest } from '~/backend/auth';
import { logOutUser } from '~/pages/api/auth/logout';
import { User } from '~/shared/types';
import { getUserSchema } from '~/shared/zodSchemas';

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User }>> {
  const cookieData = await validateRequest(context.req, context.res);
  if (
    !cookieData.user ||
    !cookieData.session ||
    !cookieData.session.isLoggedIn
  ) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  const returnThis = getUserSchema.safeParse(cookieData.user);
  if (returnThis.error) {
    await logOutUser(cookieData.session.id);
    await lucia.invalidateSession(cookieData.session.id);

    return {
      redirect: {
        permanent: true,
        destination: '/login',
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(returnThis.data)) as User,
    },
  };
}
