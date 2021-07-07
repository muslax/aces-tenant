import { useEffect, useState } from "react"
import { StatusOnlineIcon } from '@heroicons/react/solid';

export default function ActiveBatch({ batch }) {
  const [editing, setEditing] = useState(false);
  // const [activeBatch, setActiveBatch] = useState(
  //   window.localStorage
  // )
  if (!batch) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center space-x-2 mb-2">
        <h3 className="text-base text-gray-400- font-bold">Batch:</h3>
        <StatusOnlineIcon className="w-5 h-5 text-green-500" />
        <h3 className="text-base font-bold">{batch.title}</h3>
        <div className="flex-grow"></div>
      </div>

      <div className="bg-gray-50 border border-gray-300 px-4 py-2">
        <table className="w-full">
          <tbody>
            <tr className="">
              <td className="w-1/6 h-8 whitespace-nowrap pr-2">Tanggal:</td>
              <td className="h-8 px-2 font-bold">{batch.date1}</td>
            </tr>
            <tr className="">
              <td className="w-1/6 h-8 whitespace-nowrap pr-2">Status:</td>
              <td className="h-8 px-2">
                &mdash;
              </td>
            </tr>
            <tr className="">
              <td className="w-1/6 h-8 whitespace-nowrap pr-2">Jumlah peserta:</td>
              <td className="h-8 px-2 font-bold">
                <span className="">{batch.personae}</span>
                <span className="text-gray-400 ml-2">orang</span>
              </td>
            </tr>
            <tr className="">
              <td className="w-1/6 h-8 whitespace-nowrap pr-2">Test mandiri:</td>
              <td className="h-8 px-2 font-bold">
                <span className="text-gray-400">not set</span>
              </td>
            </tr>
            <tr className="">
              <td className="w-1/6 h-8 whitespace-nowrap pr-2">Test terpandu:</td>
              <td className="h-8 px-2 font-bold">
                Interview, Group Discussion
              </td>
            </tr>
            <tr className="">
              <td className="w-1/6 h-8 whitespace-nowrap pr-2">Token online:</td>
              <td className="h-8 px-2 font-bold">
                <span className="text-red-500">tom69x</span>
                <span className="text-gray-400 mx-3">/</span>
                <span className="text-gray-400">not set</span>
              </td>
            </tr>
            <tr className="">
              <td className="whitespace-nowrap pt-2 pb-3 pr-2">Grouping & skedul:</td>
              <td className="px-2 pt-2 pb-3 font-bold">
                <span className="">6 grup</span>
                <span className="text-gray-400 ml-2">(tentative)</span>
                <span className="text-blue-500 font-normal ml-2">Lihat halaman Grouping & Schedules</span>
              </td>
            </tr>

            <tr className="border-t border-gray-300">
              <td colSpan="2" className="px-4 py-3 text-center">Lorem: ...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}