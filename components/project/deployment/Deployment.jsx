import { getCurrentBatch } from "lib/utils";

export default function Deployment({ user, project }) {
  const currentBatch = getCurrentBatch(project);

  return (
    <div className="">
      <h2 className="text-lg font-bold">Deployment</h2>

      <pre>{JSON.stringify(currentBatch, null, 2)}</pre>
    </div>
  )
}