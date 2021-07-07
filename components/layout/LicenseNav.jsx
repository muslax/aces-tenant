import Link from "next/link";
import { useRouter } from "next/dist/client/router"
import { ROUTES } from "config/routes";

export default function LicenseNav() {
  const router = useRouter();
  const path = router.pathname;
  const navigation = [
    { label: 'Dashboard', href: ROUTES.Dashboard },
    { label: 'Clients', href: ROUTES.Clients },
    { label: 'Users', href: ROUTES.Users },
    { label: 'License', href: ROUTES.License },
    { label: 'Billing', href: ROUTES.Billing },
  ]

  const normal = "block pt-1 pb-1 border-b-4 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
  // const active = "block pt-1 pb-1 text-indigo-600 border-b-4 border-indigo-500 hover:text-indigo-600"
  const active = "block pt-1 pb-1 text-gray-800 border-b-4 border-gray-600 hover:text-indigo-600s"

  return (
    <div className="bg-gray-100 border-b border-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mb-px">
        <ul className="flex items-center justify-center border-t-2 border-transparent sm:justify-start text-sm text-gray-500">
        {navigation.map(({ label, href }, index) => (
          <li key={href} className={index ? 'ml-6 sm:ml-8 lg:ml-8' : ''}>
            <Link href={href}>
              <a className={href === path ? active : normal}>
                <div className="">
                  {label}
                </div>
              </a>
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}