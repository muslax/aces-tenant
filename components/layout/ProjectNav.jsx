import Link from "next/link";
import { useRouter } from "next/router";

export default function ProjectNav() {
  const router = useRouter();
  const { id } = router.query;
  const path = router.asPath;

  const navigation = [
    { label: 'Overview',    href: `/projects/${id}` },
    { label: 'Modules',     href: `/projects/${id}/modules` },
    { label: 'Persona',     href: `/projects/${id}/persona` },
    { label: 'Deployment',  href: `/projects/${id}/deployment` },
  ];

  const normal = "block pt-1 pb-2 border-b-4 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
  const active = "block pt-1 pb-2 text-green-600 border-b-4 border-green-500"

  return (
    <div className="bg-gray-50 border-b border-gray-300">
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