import { useEffect, useState } from "react";
import Link from "next/link";

import { getCurrentBatch } from "lib/utils";
import useModules from "hooks/useModules";
import { isAdmin } from "lib/utils";

import NoModules from "./NoModules";
import Subhead from "../overview/Subhead";

function getBatchModules(batch, modules) {
  if (!modules || modules.length == 0) return [];

  let array = [];
  modules.sort((a, b) => {
    if (a.order > b.order) return 1;
    else if (a.order < b.order) return -1;
    return 0;
  }).forEach(m => {
    if (batch.modules.includes(m._id)) array.push(m);
  });

  return array;
}

export default function Modules({ user, project }) {
  const currentBatch = getCurrentBatch(project);
  const { modules, isError, isLoading } = useModules();

  const batchModules = getBatchModules(currentBatch, modules);

  if (isError) return <>ERROR</>;
  if (isLoading) return null;

  if (currentBatch.modules.length == 0) return <NoModules project={project} isAdmin={isAdmin(user, project)} />;

  return (
    <div className="">
      <div className="border-b pb-2 mb-5">
        <Subhead title="Modul Batch">
          {isAdmin(user, project) && <Link href={`/projects/${project._id}/setup-modules`}>
            <a className="button-trigger px-3">Add / Remove</a>
          </Link>}
        </Subhead>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4- gap-4">
      {batchModules.map(m => (
        <div key={m._id} className="rounded border hover:shadow-sm">
          <div className="bg-gray-100 rounded-t font-bold px-3 py-2">{m.title}</div>
          <div className="text-gray-500 px-3 py-3">
            <div className="mb-2">{m.description}</div>
            <div className="">Waktu: {m.maxTime}</div>

          </div>
        </div>
      ))}
      </div>

    </div>
  )
}