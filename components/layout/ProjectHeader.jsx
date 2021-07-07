import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';

import useUser from 'hooks/useUser';
import fetchJson from 'lib/fetchJson';

import { ACESGray } from 'components/AcesIcons';
import { APIROUTES, ROUTES } from 'config/routes';

export default function ProjectHeader() {
  const router = useRouter();
  const { user, mutateUser } = useUser();

  const handleLogout = async (e) => {
    e.preventDefault()
    await mutateUser(fetchJson(APIROUTES.LOGOUT, { method: 'POST' }))
    router.push(ROUTES.Home)
  }

  return (
    <div className="bg-gray-50 border-bs border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex space-x-3 h-7 items-center">
          <div className="flex sm:pr-3 sm:border-r border-gray-300">
            <Link href="/">
              <a className="inline-block">
                <ACESGray className="h-6" />
              </a>
            </Link>
          </div>
          <div className="flex flex-grow justify-center sm:justify-start">
            <Link href={ROUTES.Dashboard}>
              <a className="inline-flex items-center text-gray-800 hover:text-gray-600">
                <div className="rounded-full bg-gray-100 w-7 h-7 mr-2">
                  {user.license.logoUrl && <Image
                    src={user.license.logoUrl}
                    width={28}
                    height={28}
                    className="object-contain rounded-full w-7 h-7"
                  />}
                </div>
                <span className="text-sm font-medium">
                  {user.license.title}
                </span>
              </a>
            </Link>
          </div>
          <div className="flex items-center text-xs">
            <div className="hidden sm:block uppercase">
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
  );
}