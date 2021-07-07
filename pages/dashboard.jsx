import Head from 'next/head';

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import LicenseLayout from "components/layout/LicenseLayout";
import Dashboard from 'components/license/Dashboard';

const LicensePage = () => {
  const { user } = useUser();

  if (!user || !user.isLoggedIn) return null;

  return <>
    <Head>
      <title>Dashboard - ACES</title>
    </Head>
    <Dashboard user={user} />
  </>;
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;
