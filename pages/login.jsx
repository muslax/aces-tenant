import Head from "next/head";
import WebLayout from "components/layout/WebLayout";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import { useState } from "react";
import fetchJson from "lib/fetchJson";

const Login = () => {
  const { mutateUser } = useUser();

  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
      // router.push('/protected'); // ROUTES.Dashboard
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMessage(error.data.message)
    }

    setSubmitting(false)
  }

  const inputBase = "w-full px-3 py-2 rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
  const btnBase = "bg-blue-600 w-full py-2 font-bold text-gray-50 rounded focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 active:text-white active:bg-plum-700"

  return <>
    <Head>
      <title>ACES Login</title>
    </Head>
    <div className="flex flex-col items-center justify-center w-full min-h-screen border-t-8 border-blue-500 py-10">
      <div className="rounded-md border-4 border-plum-200 border-opacity-50">
        <div className="rounded border border-plum-300 hover:border-plum-400 shadow-sm p-5">
          <form className="w-64" onSubmit={handleSubmit}>
            <div className="flex justify-center mb-4">
              {/* <ACESCapsPlum10 /> */}
            </div>

            <p className="mb-5 text-lg text-center">
              {/* <span className="font-semibold mr-2">Selamat datang.</span> */}
              Masukkan username dan password Anda.
            </p>

            <div className="mb-4">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="username"
                required
                autoFocus
                autoComplete="off"
                className={inputBase}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required
                className={inputBase}
              />
            </div>

            <div className="h-4 flex items-center text-sm bg-gray-100s">
              {errorMessage && !submitting && <p className="text-red-500">
                ERROR {errorMessage}
              </p>}
              {submitting && <div
                className="h-1 w-full rounded-full shadows"
                style={{ backgroundImage: 'url(mango-in-progress-01.gif)' }}
              ></div>}
              {!errorMessage && !submitting && <><hr className="w-full border-gray-300" /></>}
            </div>

            <div className="flex items-center justify-between my-4">
              <button className={btnBase} type="submit">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;
}

Login.redirectAuthenticatedTo = ROUTES.Dashboard;
Login.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default Login;