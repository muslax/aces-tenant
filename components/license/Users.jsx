import { useState } from 'react';
import Link from 'next/dist/client/link';

import useUsers from "hooks/useUsers";
import { ROUTES } from 'config/routes';

import Heading from './Heading';
import FormUser from './FormUser';
import UserCards from './UserCards';

const Users = ({ user }) => {
  const { users, isError, isLoading, mutate: mutatUsers } = useUsers();

  const [form, setForm] = useState(false);

  if (isLoading) return null;

  function handleClick(e) {
    e.preventDefault();
    setForm(!form);
  }

  return <>
    <Heading title={form ? 'Add New User' : 'Daftar User'}>
      {user.licenseOwner && !form && (
        <Link href={ROUTES .CreateUser}>
          <a className="button-link-license" onClick={handleClick}>
            New User
          </a>
        </Link>
      )}
    </Heading>
    {!form && (
      <UserCards user={user} persons={users} mutate={mutatUsers} />
    )}
    {form && (
      <FormUser
        onCancel={e => setForm(false)}
        mutate={mutatUsers}
        callback={() => setForm(false)}
      />
    )}
  </>;
}

export default Users;
