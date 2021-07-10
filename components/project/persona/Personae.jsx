import { useState } from "react";
import Link from "next/link";

import { getCurrentBatch, isAdmin } from "lib/utils";
import useBatchPersonae from "hooks/useBatchPersonae";

import NoPersonae from "./NoPersonae";

export default function Personae({ user, project }) {
  const currentBatch = getCurrentBatch(project);
  const { personae, isError, isLoading, mutate } = useBatchPersonae(currentBatch._id);

  if (isLoading) return null;

  if (personae.length == 0) return <NoPersonae project={project} isAdmin={isAdmin} />

  return (
    <div className="">
      <div className="flex items-center space-x-4 py-3 mb-4">
        <p className="flex-grow font-bold">
          Daftar peserta - {personae.length} orang
        </p>
        <div className="flex space-x-3 text-xs">
          <Link href={`/projects/${project._id}/setup-modules`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Add</a>
          </Link>
          <Link href={`/projects/${project._id}/import-csv`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Import CSV</a>
          </Link>
        </div>
      </div>

      {personae.map(p => <p key={p._id} className="mb-2">{p.group} - {p.fullname}</p>)}



      <pre>{JSON.stringify(currentBatch, null, 2)}</pre>
      <pre>{JSON.stringify(personae, null, 2)}</pre>

    </div>
  )
}