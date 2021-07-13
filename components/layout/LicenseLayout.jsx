import Link from 'next/link';
import { ACESGray } from 'components/AcesIcons';
import { APIROUTES } from 'config/routes';
import useUser from 'hooks/useUser';
import fetchJson from 'lib/fetchJson';
import LicenseHero from './LicenseHero';
import LicenseNav from './LicenseNav';

export default function LicenseLayout({ children }) {
  const { user, isLoading, mutateUser } = useUser();

  const handleLogout = async (e) => {
    e.preventDefault()
    await mutateUser(fetchJson(APIROUTES.LOGOUT, { method: 'POST' }))
    router.push(ROUTES.Home)
  }

  return <>
    <div className="bg-gray-300 bg-opacity-80 border-b border-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex h-7 items-center">
          <div className="flex mr-3 border-r- border-gray-300">
            <Link href="/">
              <a className="inline-block">
                <ACESGray className="h-6" />
              </a>
            </Link>
          </div>
          <div className="flex flex-grow">
            <div className="inline-flex items-center text-gray-800s hover:text-gray-600">
              <span className="text-sm text-gray-600">
                By Gaia Solutions
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs">
            <div className="hidden sm:block text-indigo--500 font-semibolds uppercase">
              {user && user.fullname}
            </div>
            <div className="text-xs text-gray-600 leading-4 ml-3">
              <Link href={APIROUTES.LOGOUT}>
                <a
                  onClick={handleLogout}
                  className="inline-flex rounded border text-gray-500 hover:bg-gray-600 hover:text-white font-medium px-2 py-1"
                >
                  Logout
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gray-100 bg-opacity-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <LicenseHero user={user} isLoading={isLoading} />
      </div>
    </div>

    <LicenseNav />

    <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
      {children}
    </main>
  </>;
}