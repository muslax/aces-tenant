import Head from 'next/head';
import Link from 'next/link';

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";

import LicenseLayout from "components/layout/LicenseLayout";
import Heading from 'components/license/Heading';
import License from 'components/license/License';

const LicensePage = () => {
  const { user, mutateUser } = useUser();

  if (!user || !user.isLoggedIn) return null;

  return <>
    <Head>
      <title>License - ACES</title>
    </Head>
    <Heading title="License Info">
      <Link href={ROUTES.CreateUser}>
        <a className="license-button-link">
          Upload Logo
        </a>
      </Link>
    </Heading>
    <License user={user} />
  </>;
}

LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;