import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { validateRequest } from '~/backend/auth';
import { User } from '~/shared/types';
import { getUserSchema } from '~/shared/zodSchemas';

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User }>> {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  const returnThis = getUserSchema.safeParse(cookieData.user);
  if (returnThis.error) {
    return {
      redirect: {
        permanent: false,
        // CHECK THIS, laitettu väliaikaisesti redirectaamaan /error-sivulle. /login-sivu rikkoi pahasti
        destination: '/error',
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(returnThis.data)) as User,
    },
  };
}
