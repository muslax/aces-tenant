import Head from 'next/head';

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import Heading from 'components/license/Heading';
import LicenseLayout from "components/layout/LicenseLayout";
import Clients from 'components/license/Clients';

const LicensePage = () => {
  const { user } = useUser();

  if (!user || !user.isLoggedIn) return null;

  return <>
    <Head>
      <title>Daftar Klien - ACES</title>
    </Head>
    <Heading title="Daftar Klien"></Heading>
    <Clients user={user} />
  </>;
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;
