import Head from 'next/head'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-5 text-center">
        <h1 className="text-6xl font-bold my-8">
          Welcome to{' '}
          <a href="/login" className="text-blue-600">
            ACES!
          </a>
        </h1>

        <div className="max-w-4xl mx-auto text-left">

          <hr className="border-4 border-gray-500 mb-5"/>

          <p className="my-3">Powered by Judul Proyek</p>

          <p className="my-3">
            <input type="text" className="border-red-400" placeholder="Holobis" />
          </p>

          <p className="my-3">
            <input type="date" className="input-license" />
          </p>

          <p className="my-3">
            <select className="input-license error">
              <option>Menary</option>
              <option>Menary</option>
              <option>Menary</option>
            </select>
          </p>

        </div>





        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-lg">
              Find in-depth information about Next.js features and API.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
