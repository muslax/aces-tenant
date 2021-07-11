import { useEffect, useState } from 'react';
import { BeakerIcon, UsersIcon, StatusOnlineIcon } from '@heroicons/react/solid';
import { CogIcon } from '@heroicons/react/outline';
import fetchJson from 'lib/fetchJson';
import { APIROUTES } from 'config/routes';
import { generatePOSTData, getCurrentBatch } from 'lib/utils';
import Subheading from './Subheading';

export default function BatchTable({ project, currentBatch, callback, editable, mutate }) {
  // const pid = batches[0].pid;
  const pid = project._id;
  const _batches = project.batches.sort((a, b) => {
    if (a._id > b._id) return -1;
    else if (a._id < b._id) return 1;
    return 0;
  });

  const [vStack, setVStack] = useState(null);
  const [batchCopy, setBatchCopy] = useState(null);

  async function updateBatch(e) {
    await fetchJson(APIROUTES.POST.UPDATE_BATCH, generatePOSTData({
      id: batchCopy._id,
      title: batchCopy.title,
      date1: batchCopy.date1,
    }))

    mutate(`${APIROUTES.GET_PROJECT}&pid=${pid}`);
    setVStack(null);
    // callback(batchCopy);
    if (batchCopy._id == currentBatch?._id) {
      callback(batchCopy);
    }

    if (batchCopy._id == currentBatch?._id) {
      window.localStorage.setItem(batchCopy.pid, JSON.stringify(batchCopy));
    }
  }

  async function deleteBatch(e, id) {
    // Check if target batch = currentBatch
    // If so, nullify currentBatch first
    if (id == currentBatch?._id) {
      window.localStorage.removeItem(pid);
      callback(getCurrentBatch(project, id));
    }

    await fetchJson(APIROUTES.POST.DELETE_BATCH, generatePOSTData({
      id: id,
    }))

    mutate();
    setVStack(null);
  }

  function getLocalStorage() {
    return window.localStorage.getItem(pid);
  }

  return (
    <div className="">
      <Subheading title="Select / Edit Batch" />

      <table className="w-full leading-relaxed border-b mb-10">
        {_batches.map(b => (
          <tbody key={b._id}>
          {(!vStack || vStack._id != b._id) && (
            <tr className={`${b._id == currentBatch?._id ? 'bg-gray-50' : ''} border-t align-middle`}>
              <td className="w-6 h-12 pl-2">
                <StatusOnlineIcon className={b._id == currentBatch?._id
                  ? "w-5 h-5 "
                  : "w-5 h-5 text-gray-400"
                } />
              </td>
              <td width="30%" className="px-2 h-12 font-semibold">{b.title}</td>
              <td width="" className="hidden sm:table-cell px-2 h-12">{b.date1 ? b.date1 : 'not set'}</td>
              <td className="hidden md:table-cell px-2 h-12">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-4 h-4 text-gray-300"/>
                  <span className="font-medium w-10">{b.personae}</span>
                </div>
              </td>
              <td className="hidden md:table-cell px-2 h-12">
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-4 h-4 text-gray-300"/>
                  <span className="font-medium w-10">{b.modules.length}</span>
                </div>
              </td>
              <td className="px-2 h-12">
                <div className="flex items-center space-x-3">
                  <div className="flex-grow flex space-x-2 pl-4">
                    <div className="flex-grow">
                      {!vStack && editable && <button
                        className="hidden md:inline-flex"
                        value={b._id}
                        onClick={e => {
                          setVStack(b);
                          setBatchCopy(b);
                        }}
                      >Edit</button>}
                      {!editable && <button className="text-gray-300">Edit</button>}
                    </div>
                    {currentBatch?._id == b._id && (
                      <button
                        disabled
                        className="text-xs rounded-sm h-6 px-4 font-medium bg-gray-600 text-white"
                      >Active</button>
                    )}
                    {currentBatch?._id != b._id && !vStack && (
                      <button
                        className="text-xs rounded-sm h-6 px-2 font-medium border border-blue-300 hover:border-blue-400 active:border-blue-500 text-blue-400 hover:text-blue-500"
                        onClick={e => {
                          const key = b.pid;
                          window.localStorage.setItem(key, JSON.stringify(b));
                          callback(b);
                          setVStack(null);
                        }}
                      >Activate</button>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          )}
          {vStack && vStack._id == b._id && (
            <tr className={`border-t align-middle`}>
              <td className="w-6 h-12 pl-2">
                <StatusOnlineIcon className={b._id == currentBatch?._id
                  ? "w-5 h-5 text-green-500"
                  : "w-5 h-5 text-gray-300"
                } />
              </td>
              <td width="25%" className="px-2 h-12 font-semibold">
                <input
                  type="text" className="input-project tight w-full"
                  value={batchCopy.title}
                  autoFocus={true}
                  onChange={e => setBatchCopy(p => ({...p, ['title']: e.target.value }))}
                />
              </td>
              <td width="25%" className="px-2 h-12">
                <input
                  type="date"
                  value={batchCopy.date1}
                  className="input-project tight w-full"
                  placeholder="dd-mm-yyyy"
                  onChange={e => setBatchCopy(p => ({...p, ['date1']: e.target.value }))}
                />
              </td>
              <td className="px-2 h-12">
                <div className="flex items-center space-x-2">
                  <div className="flex-grow flex flex-row">
                    <button
                      className="text-xs rounded-sm borders h-6 px-4 mr-3 font-medium bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
                      onClick={updateBatch}
                    >Save</button>
                    <button
                      className="text-xs rounded-sm border border-gray-300 hover:border-gray-400 h-6 px-2 font-medium text-gray-500"
                      onClick={e => setVStack(null)}
                    >Cancel</button>
                  </div>
                  <div className="flex space-x-2">
                    {!b.protected && <button
                      className="text-xs rounded-sm border border-red-300 hover:border-red-400 h-6 px-2 font-medium text-red-400"
                      onClick={e => deleteBatch(e, b._id)}
                    >Delete</button>}
                    {b.protected && <button
                      value={b._id}
                      className="text-xs rounded-sm border h-6 px-2 font-medium text-gray-400"
                    >Delete</button>}
                  </div>
                </div>
              </td>
            </tr>
          )}
          </tbody>
        ))}
      </table>
    </div>
  )
}