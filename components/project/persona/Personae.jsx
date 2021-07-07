import { useState } from "react";
import { getCurrentBatch } from "lib/utils";

export default function Personae({ user, project }) {
  const currentBatch = getCurrentBatch(project);

  return (
    <div className="">
      <h2 className="text-lg font-bold">Personae</h2>

      <pre>{JSON.stringify(currentBatch, null, 2)}</pre>
      {/* <pre>{JSON.stringify(personae, null, 2)}</pre> */}

    </div>
  )
}