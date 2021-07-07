import { useState } from 'react';
import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/solid';

import useProjects from "hooks/useProjects";
import { ROUTES } from 'config/routes';

import Heading from './Heading';
import FormProject from './FormProject';
import { CardBox } from './Boxes';

const Dashboard = ({ user }) => {
  const { projects, isError, isLoading, mutate: mutateProjects } = useProjects();

  const [form, setForm] = useState(false);

  if (isLoading) return null;

  function handleClick(e) {
    e.preventDefault();
    setForm(!form);
  }

  const icon = <FolderIcon className="h-6 w-6 text-gray-300"/>;

  return <>
    <Heading title={form ? 'New Project' : 'ACES Projects'}>
      {user.licenseOwner && !form && (
        <Link href={ROUTES.CreateProject}>
          <a className="button-link-license" onClick={handleClick}>
            New Project
          </a>
        </Link>
      )}
    </Heading>

    {!form && (
    <div className="flex flex-col space-y-4">
      {projects.map(project => (
        <CardBox key={project._id} icon={icon}>
          <div className="text-base mb-2">
            <Link href={`/projects/${project._id}`}>
              <a className="font-bold text-blue-500 hover:text-blue-600">{project.title}</a>
            </Link>
          </div>
          <div className="text-xs">
            <p className="mb-1">Client: <span className="font-semibold">{project.client.name}</span></p>
            <p className="mb-1">Admin: <span className="font-semibold">{project.admin.fullname}</span></p>
          </div>
        </CardBox>
      ))}
    </div>
    )}
    {form && <FormProject
      onCancel={e => setForm(false)}
      mutate={mutateProjects}
      callbak={() => setForm(false)}
    />}

    <pre>{JSON.stringify(projects, null, 2)}</pre>
  </>;
}

export default Dashboard;
