import { FolderIcon, IdentificationIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import { CalendarIcon } from "@heroicons/react/outline";

export default function Yellow () {
  return (
    <>
      <div className="bg-yellow-300 bg-opacity-90 bg-gradient-to-b from-yellow-200">
        <div className="max-w-4xl mx-auto px-5">
          <div className="py-4">
            <div className="flex h-7">
              <h2 className="text-base text--white font-bold">
                PT Adonara Sakti Makata
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-5 text--xs font--medium h-10 pt-1">
            <span className="h-9">Overview</span>
            <span className="h-9 pt-1 border-gray-700" style={{ borderBottomWidth: '5px' }}>Modules</span>
            <span className="h-9">Persona</span>
            <span className="h-9">Deployment</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5">
        <div className="py-7 border-b">
          <div className="w-full md:w-4/6 bg--gray-50">
            <h1 className="text-2xl md:text-3xl font-bold">
              Asignment Akhir Tahun Staf Level IV
            </h1>
          </div>

          <div className="flex flex-col space-y-1 py-2">
            <div className="flex items-center space-x-2">
              <IdentificationIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">Yayasan Obor Jingga</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-pink-400" />
              <span className="font-bold">Lidi Astuti</span>
            </div>
            <div className="flex items-center pt-1">
              <button className="h-6 rounded-tl bg-gray-400 text-xss text-white font-bold uppercase px-2">Batch</button>
              <button className="h-6 rounded-br bg-yellow-300 text-xss text--yellow-400 font-bold uppercase px-2">Project</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}