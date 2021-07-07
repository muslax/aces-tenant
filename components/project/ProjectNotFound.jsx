import { ROUTES } from "config/routes";
import Head from "next/head";
import Link from "next/link";

export default function ProjectNotFound({ code }) {
  const hideHeaderCSS = `
  #project-header,
  #project-header-pad {
    display: none;
  }
`;

  return <>
    <Head>
      <title>ACES Error: Page Not Found</title>
      <style dangerouslySetInnerHTML={{ __html: hideHeaderCSS }} />
    </Head>
    <div className="">
      <div className="rounded border hover:border-gray-300 hover:shadow-sm px-6 py-4 my-6">
        <div className="text-red-500 mb-20 pb-3 border-b border-gray-400">
          {/* <span className="inline-block font-mono border-b-2 pb-2 mb-1">{code}</span> */}
          <p>ACES Error:</p>
          <p className="text-xl">Page Not Found</p>
        </div>
        <div>
          <Link href={ROUTES.Home}>
            <a className="text-blue-500">Home</a>
          </Link>
          <span className="text-gray-300 mx-3">|</span>
          <Link href={ROUTES.Dashboard}>
            <a className="text-blue-500">Dashboard</a>
          </Link>
        </div>
      </div>
    </div>
  </>
}