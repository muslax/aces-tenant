import Head from 'next/head';

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import LicenseLayout from "components/layout/LicenseLayout";
import Users from 'components/license/Users';

const UsersPage = () => {
  const { user } = useUser();

  if (!user || !user.isLoggedIn) return null;


  return <>
    <Head>
      <title>Daftar User - ACES</title>
    </Head>
    <Users user={user} />
  </>;
}

UsersPage.redirectUnAuthenticatedTo = ROUTES.Login;
UsersPage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default UsersPage;