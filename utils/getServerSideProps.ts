import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { validateRequest } from '~/backend/auth';
import { User } from '~/shared/types';

export async function getServerSideProps(
  context: GetServerSidePropsContext,
  customDestination?: string,
): Promise<GetServerSidePropsResult<{ user: User }>> {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user) {
    return {
      redirect: {
        permanent: false,
        destination: customDestination || '/login',
      },
    };
  }
  return {
    props: {
      user: JSON.parse(JSON.stringify(cookieData.user)) as User,
    },
  };
}
