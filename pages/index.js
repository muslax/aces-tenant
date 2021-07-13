import Head from 'next/head'
import Link from 'next/link';

import useUser from 'hooks/useUser'

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) return <></>;

  const url = user ? '/dashboard' : '/login'

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Selalu pakai masker!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white flex flex-col items-center justify-center min-h-screen p-10 text-center">
        {user && <p className="bg-yellow-300 px-3 text-white text-base font-bold uppercase">{user.fullname}</p>}
        <h1 className="text-5xl font-bold my-8">
        Selalu pakai{' '}
          <a href="/login" className="text-yellow-400">
            masker
          </a>!
        </h1>

        <div className="max-w-xl px-10 mb-12">
          <Link href={url}>
            <a className="w-full">
              <img className="w--80" src="/mask-sign.svg" />
            </a>
          </Link>
        </div>

        <p className="text-gray-400 mb-20">Clipart: https://permaclipart.org/clipart/mask-sign/</p>
      </main>
    </div>
  )
}
