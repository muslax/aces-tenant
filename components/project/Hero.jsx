import {  FolderIcon, IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/solid';
import { getCurrentBatch } from 'lib/utils';

export default function Hero({ project, title, isIndex = false }) {
  const currentBatch = getCurrentBatch(project);

  if (isIndex) return (
    <div className="pt-7 pb-3">
      <h2 className="text-2xl text-green-600 font-bold mt-1 mb-2">{project.title}</h2>

      <div className="flex items-center space-x-2 mb-px">
        <IdentificationIcon className="w-5 h-5 text-green-500" />
        <div className="text-gray-600- font-bold">{project.client.name}</div>
      </div>

      <div className="flex items-center space-x-2 mb-px">
        <ShieldCheckIcon className="w-5 h-5 text-yellow-400" />
        <div className="text-gray-600">Admin: {project.admin.fullname}</div>
      </div>

      {/* <div className="text-xs text-gray-600 mt-3">
        <div className="inline-flex items-centers rounded-sms border border-gray-300">
          <span className="h-7 flex items-center border-r border-gray-300 px-2">BATCH</span>
          <span className="flex items-center font-semibold pl-3 pr-4">Marketing &amp; Finance</span>
        </div>
      </div> */}
    </div>
  )

  return (
    <div className="py-7">
      <h2 className="text-3xl font-light mb-2">{title}</h2>

      <div className="flex items-center space-x-2">
        <FolderIcon className="w-5 h-5 text-yellow-400" />
        <div className="text-bases text-green-600 font-bold">{project.title}</div>
      </div>

      <div className="flex items-center space-x-2 text-xs-">
        <IdentificationIcon className="w-5 h-5 text-gray-400" />
        <div className="text-gray-600">{project.client.name}, {project.client.city}</div>
      </div>

      <div className="text-xs text-gray-600 mt-3">
        <div className="inline-flex items-centers rounded-sms border border-gray-300">
          <span className="h-7 flex items-center border-r border-gray-300 px-2">BATCH</span>
          <span className="flex items-center font-semibold pl-3 pr-4">{currentBatch.title}</span>
        </div>
      </div>
    </div>
  )
}