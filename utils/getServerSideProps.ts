import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { validateRequest } from '~/backend/auth';
import { User } from '~/shared/types';

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User }>> {
  const cookieData = await validateRequest(context.req, context.res);
  console.log('getServerSideProps.ts', cookieData);
  if (!cookieData.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  return {
    props: {
      user: JSON.parse(JSON.stringify(cookieData.user)) as User,
    },
  };
}
