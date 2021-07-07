import { useState } from "react";
import { CogIcon, UserCircleIcon } from '@heroicons/react/solid';

import ChangePassword from "./ChangePassword";
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";

import { CardBox } from "./Boxes";
import FixedOverlay from "components/FixedOverlay";
import PostModal from "components/PostModal";

const UserCards = ({ user, persons, mutate }) => {
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [resetResponse, setResetResponse] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  function canEdit(person) {
    return user.licenseOwner && user.username != person.username;
  }

  async function deleteUser() {
    if (!selected) return false;
    setModal('Deleting user...');

    await fetchJson(APIROUTES.POST.DELETE_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected._id}),
    })

    mutate();
    setSelected(null);
    setModal(null);
  }

  async function disableUser() {
    if (!selected) return false;
    setModal('Updating user...');

    await fetchJson(APIROUTES.POST.DISABLE_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected._id}),
    })

    mutate();
    setSelected(null);
    setModal(null);
  }

  async function activateUser() {
    if (!selected) return false;
    setModal('Updating user...');

    await fetchJson(APIROUTES.POST.ACTIVATE_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected._id}),
    })

    mutate();
    setSelected(null);
    setModal(null);
  }

  async function resetUser() {
    if (!selected) return false;
    setModal('Resetting user...');

    const response = await fetchJson(APIROUTES.POST.RESET_USER, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected._id}),
    })

    setResetResponse(response);
    mutate();
    setSelected(null);
    setModal(null);
  }

  const icon = <UserCircleIcon className="h-6 w-6 text-gray-300"/>;
  const iconSelf = <UserCircleIcon className="h-6 w-6 text-gray-500"/>;

  return <>
    <div className="flex flex-col space-y-2">
      {persons.map(person => (
        <CardBox key={person._id} icon={person.username == user.username ? iconSelf : icon}>
          <div className="flex">
            <div className="flex-grow font-bold mb-1">{person.fullname}</div>
            <div>
              {canEdit(person) && selected?._id != person._id  && (
                <button
                  className="flex items-center space-x-1 text-xs text-gray-500 rounded-sm border hover:border-indigo-400 hover:text-indigo-500 pl-2 pr-3 py-1"
                  onClick={e => setSelected(person)}
                >
                  <CogIcon className="w-4 h-4 text-gray-500s" />
                  <span className="text-gray-400s">Edit</span>
                </button>
              )}
              {user.username == person.username && (
                <button
                  className="text-xs text-gray-500 whitespace-nowrap h-6 border-b hover:text-indigo-500 hover:border-indigo-400"
                  onClick={e => setShowPasswordDialog(true)}
                >Change Password</button>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {person.email}
          </div>
          {selected?._id == person._id && (
            <div className="flex items-center space-x-2 pt-3">
              {!person.disabled && <button
                onClick={resetUser}
                className="bg-indigo-400 hover:bg-indigo-500 text-xs text-white rounded-sm px-3 py-1"
              >Reset Password</button>}
              {!person.disabled && <button
                onClick={disableUser}
                className="bg-gray-500 hover:bg-gray-600 text-xs text-white rounded-sm px-3 py-1"
              >Disable</button>}
              {person.disabled && <button
                onClick={activateUser}
                className="bg-gray-500 hover:bg-gray-600 text-xs text-white rounded-sm px-3 py-1"
              >Activate</button>}
              <button
                className="bg-red-500 hover:bg-red-600 text-xs text-white rounded-sm px-3 py-1"
                onClick={deleteUser}
              >Delete</button>
              <div className="flex-grow"></div>
              <button
                onClick={e => setSelected(null)}
                className="border hover:border-gray-400 text-xs text-whites rounded-sm px-3 py-1"
              >Cancel</button>
            </div>
          )}
        </CardBox>

      ))}
    </div>
    {modal && (
      <PostModal message={modal} />
    )}
    {resetResponse && (
      <FixedOverlay dark={true}>
        <ResetResponse response={resetResponse}
          callback={e => {
            setResetResponse(null);
          }}
        />
      </FixedOverlay>
    )}
    {showPasswordDialog && (
      <FixedOverlay dark={true}>
        <ChangePassword callback={e => setShowPasswordDialog(false)} />
      </FixedOverlay>
    )}
    {/* <pre>{JSON.stringify(resetResponse, null, 2)}</pre> */}
  </>;
}

export default UserCards;

function ResetResponse ({ response, callback }) {
  return (
    <div className="w-auto rounded border border-gray-400 bg-white text-gray-700 shadow">
      <h3 className="text-xl mx-4 mt-4 mb-3">New Password</h3>
      <div className="flex border-t text-sm pl-4 pr-10 py-2">
        <div className="w-20 text-right">Username:</div>
        <div className="flex-grow font-bold pl-3">{response?.username}</div>
      </div>
      <div className="flex border-t text-sm pl-4 pr-10 py-2">
        <div className="w-20 text-right">Fullname:</div>
        <div className="flex-grow font-bold pl-3">{response?.fullname}</div>
      </div>
      <div className="flex border-t text-sm pl-4 pr-10 py-2">
        <div className="w-20 text-right">Password:</div>
        <div className="flex-grow font-bold pl-3">{response?.password}</div>
      </div>
      <div className="border-t text-sm text-white text-center px-4 py-4">
        <button
          className="h-7 px-4 focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
          onClick={callback}
        >
          Close
        </button>
      </div>
    </div>
  )
}
