import Head from 'next/head';

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import Heading from 'components/license/Heading';
import LicenseLayout from "components/layout/LicenseLayout";

const Billing = () => {
  const { user, mutateUser } = useUser();

  if (!user || !user.isLoggedIn) return null;

  return <>
    <Head>
      <title>Billing - ACES</title>
    </Head>
    <Heading title="Billing"></Heading>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </>;
}

Billing.redirectUnAuthenticatedTo = ROUTES.Login;
Billing.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default Billing;