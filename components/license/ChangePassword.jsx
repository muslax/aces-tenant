import { useState } from "react";

import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";

const ChangePassword = ({ callback }) => {
  const [submitting, setSubmitting] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassowrd, setNewPassowrd] = useState('');
  const [cwResponse, setCwResponse] = useState(null);
  const [cwResult, setCwResult] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);


    const response = await fetchJson(APIROUTES.POST.CHANGE_PASSWORD, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ oldPassword: oldPassword, newPassowrd: newPassowrd }),
    })

    if (response) {
      console.log('RESPONSE', response);
      setCwResponse(response);
      setCwResult(response.ok);
    }

    setSubmitting(false);
  }

  return (
    <div className="w-80 rounded border border-gray-400 bg-white shadow">
      <h3 className="text-xl mx-4 mt-4 mb-3">Change password</h3>

      {cwResponse && cwResult && <div className="px-4 py-8 border-t border-b text-indigo-600">
        Password Anda telah berhasil diganti.
      </div>}

      {(!cwResponse || !cwResult) && <>
        <div className="flex items-center border-t text-sm pl-4 pr-6 pt-4 pb-2">
          <div className="w-32 text-rights">Current password:</div>
          <div className="flex-grow pl-3">
            <input type="password"
              className="w-36 text-sms rounded border border-gray-300 focus:border-indigo-400 focus:ring focus:ring-indigo-50 px-3 py-1"
              value={oldPassword}
              disabled={submitting}
              onChange={e => setOldPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center border-b text-sm pl-4 pr-6 pb-4">
          <div className="w-32 text-rights">New password:</div>
          <div className="flex-grow pl-3">
            <input type="password"
              className="w-36 text-sms rounded border border-gray-300 focus:border-indigo-400 focus:ring focus:ring-indigo-50 px-3 py-1"
              value={newPassowrd}
              disabled={submitting}
              onChange={e => setNewPassowrd(e.target.value)}
            />
          </div>
        </div>
      </>}
      <div className="text-center pb-5">
        <div className={(submitting ? 'progress' : '')  + " h-1 mb-4"}></div>
        {(!cwResponse || !cwResult) && <>
          <button
            disabled={submitting}
            className="h-7 px-4 text-sm text-white focus:outline-none rounded bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 font-medium mr-3"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            disabled={submitting}
            className="h-7 px-4 text-sm text-white focus:outline-none rounded bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 font-medium mr-3"
            onClick={callback}
          >
            Cancel
          </button>
        </>}
        {cwResponse && cwResult && <button
          className="h-7 px-4 text-sm text-white focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
          onClick={callback}
        >
          Close
        </button>}
      </div>
      {cwResponse && !cwResult && <div className="text-sm text-center text-red-500 pb-2">
        {cwResponse.message}
      </div>}
    </div>
  )
}

export default ChangePassword;
// "hashed_password": "$2a$10$yp9XsQNKAWQtWnNRjSY3BO9M58fa/iqPdtTlxT7SkI7M10s5EBGD2",
