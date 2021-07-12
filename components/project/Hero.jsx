import { EyeIcon, FolderIcon, IdentificationIcon, ShieldCheckIcon, StatusOnlineIcon } from '@heroicons/react/solid';
import { CalendarIcon } from '@heroicons/react/outline';
import { getCurrentBatch } from 'lib/utils';

export default function Hero({ project, title, isIndex = false }) {
  const currentBatch = getCurrentBatch(project);

  if (isIndex) return (
    <div className="pt-7 pb-5 border--b">
      <h2 className="text-2xl text-green-600 font-medium mt-1 mb-2 truncate">{project.title}</h2>

      <div className="flex flex-col space-y-px font-medium">
        <div className="flex items-center space-x-3">
          <IdentificationIcon className="w-5 h-5 text-yellow-400" />
          <div className="text-gray-400-">{project.client.name}, {project.client.city}</div>
        </div>

        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <div className="">Kontrak: {project.contractDate}</div>
        </div>

        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
          <div className="">Admin: {project.admin.fullname}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="py-7 border--b">
      <h2 className="text-3xl font-light mb-2">{title}</h2>

      <div className="flex flex-col space-y-px font-medium">
        <div className="flex items-center space-x-3">
          <FolderIcon className="w-5 h-5 text-green-500" />
          <div className="">{project.title}</div>
        </div>

        <div className="flex items-center space-x-3">
          <IdentificationIcon className="w-5 h-5 text-yellow-400" />
          <div className="text-gray-400-">{project.client.name}, {project.client.city}</div>
        </div>

        <div className="flex items-center space-x-3">
          <StatusOnlineIcon className="w-5 h-5 text-pink-500" />
          <div className="">Batch: {currentBatch?.title}</div>
        </div>
      </div>
    </div>
  )
}