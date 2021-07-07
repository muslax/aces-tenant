import { validateEmail } from "lib/utils";
import { useState } from "react"

import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";

export default function FormUser({ onCancel, mutate, callback }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  async function handleSubmit(e) {
    setSubmitting(true);
    const url = APIROUTES.POST.NEW_USER;
    console.log(url);
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        fullname: fullname,
        username: username,
        email: email
      }),
    })

    if (response) {
      setSubmitting(false);
      setCreatedUser(response);
      mutate();
      callback()
    }
  }

  return <>
    <div className="form-box">
      <table className="w-full">
        <tbody>
          <tr className="">
            <td colSpan="2" className="px-5 pt-4 pb-3">
              Semua kolom harus diisi.
            </td>
          </tr>
          <tr className="">
            <td colSpan="2" className="px-5">
              <div className={(submitting ? 'progress ' : '') + 'bg-gray-200s border-t border-gray-400 h-1 mb-3'}></div>
            </td>
          </tr>

          <tr>
            <td width="25%" className="whitespace-nowrap px-5 pt-1 pb-2">Nama Lengkap:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                value={fullname}
                autoFocus={false}
                className="input-license w-full font-bold"
                onChange={e => setFullname(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                  if (v.length == 0) setNameError("Kolom nama harus diisi.")
                  else setNameError(null)
                }}
              />
            </td>
          </tr>

          <tr>
            <td width="25%" className="whitespace-nowrap px-5 pt-1 pb-2">Email:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                value={email}
                className="input-license w-full font-bold"
                onChange={e => setEmail(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim().toLowerCase();
                  setEmailError(validateEmail(v) ? null : "Email tidak valid.")
                  setEmail(v);
                }}
              />
            </td>
          </tr>

          <tr>
            <td width="25%" className="whitespace-nowrap px-5 pt-1 pb-2">Username:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                placeholder="Minimal 6 karakter"
                value={username}
                className="input-license font-bold"
                onChange={e => setUsername(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim().toLowerCase();
                  setUsernameError(v.length > 5 ? null : "Username minimal 6 karakter.")
                  setUsername(v);
                }}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td className="text-xss leading-snug text-red-500 pr-4">
              {nameError && <p className="my-px ">{nameError}</p>}
              {emailError && <p className="my-px ">{emailError}</p>}
              {usernameError && <p className="my-px ">{usernameError}</p>}
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="py-3 pr-4">
              <div className="flex space-x-3">
                <button className="rounded-sm bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-200 font-semibold h-8 px-5"
                  onClick={handleSubmit}
                >
                  Save User
                </button>
                <button className="rounded-sm border border-gray-300 hover:border-gray-400 text-gray-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-200 font-semibold h-8 px-5" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    {submitting && (
      <div className="fixed w-full h-screen top-0 left-0"></div>
    )}
    {/* {!createdUser && (
      <div className="flex justify-center items-center fixed w-full h-screen top-0 left-0">
        <div className="max-w-xl">
          <pre>{JSON.stringify(createdUser, null, 2)}</pre>
        </div>
      </div>
    )} */}
  </>;
}