import { useEffect, useState } from 'react';
import { BeakerIcon, UsersIcon, StatusOnlineIcon } from '@heroicons/react/solid';
import { CogIcon } from '@heroicons/react/outline';
import fetchJson from 'lib/fetchJson';
import { APIROUTES } from 'config/routes';
import { generatePOSTData, getCurrentBatch } from 'lib/utils';
import Subhead from './Subhead';

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

  const [newForm, setNewForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

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

  async function saveNewBatch(e) {
    if (!title || !date) return;

    await fetchJson(APIROUTES.POST.SAVE_NEW_BATCH, generatePOSTData({
      pid: project._id,
      title: title,
      date: date,
    }))

    mutate();
    setNewForm(false);
    setTitle("");
    setDate("");
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

  function isAdmin() {
    return user.username == project.admin.username;
  }

  return (
    <div className="">
      <div className="pb-2">
        <Subhead title="Select / Edit Batch">
          {editable && !newForm && <button
            className="button-trigger px-4"
            onClick={e => {
              setNewForm(true);
              setVStack(null);
            }}
          >New Batch</button>}
        </Subhead>
      </div>

      {newForm && (
        <div className="border-t px-10 pt-3 pb-5">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-2xl mx-auto">
            <div className="col-span-5 sm:col-span-3 pr--6 sm:px-0">
              <label className="block text-xss uppercase mb-px">Nama Batch</label>
              <input
                type="text"
                className="text-sm w-full h-8 leading-tight px-2 py-1 rounded bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                value={title}
                autoFocus={true}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="col-span-5 sm:col-span-2 pr--6 sm:px-0">
              <label className="block text-xss uppercase mb-px">Tanggal</label>
              <input
                type="date"
                className="text-sm w-full h-8 leading-tight px-2 py-1 rounded bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                value={date}
                placeholder="dd-mm-yyyy"
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="col-span-5 pr--6 sm:px-0 pt-1">
              <div className="flex">
                <div className="flex-grow">

                </div>
                <div className="flex">
                  <button
                    className="text-xs rounded-sm borders h-6 px-6 mr-3 font-medium bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
                    onClick={saveNewBatch}
                  >Save</button>
                  <button
                    className="text-xs rounded-sm border border-gray-300 hover:border-gray-400 h-6 px-2 font-medium text-gray-500"
                    onClick={e => setNewForm(false)}
                  >Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="w-full leading-relaxed border-b mb-10" style={{ tableLayout: 'fixed' }} >
        <tbody className="THIS IS FOR PERSISTING LAYOUT">
          <tr>
            <td className="w-9"></td>
            <td className="w-7/12 sm:w-5/12"></td>
            <td className="w-2/12 sm:w-4/12 md:w-5/12"></td>
            <td className="w-20"></td>
          </tr>
        </tbody>
        {_batches.map(b =>(
          <tbody key={b._id}>
            {(!vStack || vStack._id != b._id) && (
              <tr className="border-t" style={{  }}>
                <td className="w-9 px-1 py-3">
                  <StatusOnlineIcon className="w-5 h-5" />
                </td>
                <td className="w-7/12 sm:w-5/12 px-2 py-3 border--l">
                  <div
                  className="font-bold"
                  style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {b.title}
                  </div>
                </td>
                <td className="w-2/12 sm:w-4/12 md:w-5/12 px-2 py-3 border--l">
                  <div className="flex items-center justify-center md:justify-around sm:space-x-3">
                    <div className="hidden md:flex w--24 font--bold bg-yellow--200 whitespace-nowrap">
                      {b.date1}
                    </div>
                    <div className="hidden md:flex items-center space-x-1 bg--yellow-200">
                      <UsersIcon className="w-4 h-4 text-gray-300"/>
                      <span className="font--bold">{b.personae}</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1 bg--yellow-200">
                      <BeakerIcon className="w-4 h-4 text-gray-300"/>
                      <span className="font--bold">{b.modules.length}</span>
                    </div>
                    <div className="hidden- sm: flex items-center space-x-1 bg-yellow--200">
                      {!vStack && editable && (
                        <button
                          className="text-xs rounded-sm h-6 px-2 font-medium bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-500 text-yellow-600 hover:text-yellow-700"
                          value={b._id}
                          onClick={e => {
                            if (newForm) return;
                            setVStack(b);
                            setBatchCopy(b);
                          }}
                        >EDIT</button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="w-20 px-2 py-3 border--l">
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
                  {currentBatch?._id == b._id && (
                    <button
                      disabled
                      className="text-xs rounded-sm h-6 px-4 font-medium bg-gray-600 text-white"
                    >Active</button>
                  )}
                </td>
              </tr>
            )}
            {(vStack && vStack._id == b._id) && (
              <tr className="border-t">
                <td className="w-9 px-1 pt-3 align-top">
                  <StatusOnlineIcon className="w-5 h-5 text-gray-300" />
                </td>
                <td colSpan="2" className="border--l px-2 pt-2 pb-3">
                  <div className="grid grid-cols-5 gap-2 sm:gap-3 md:max-w-2xl">
                    <div className="col-span-5 sm:col-span-3 pr-6 sm:px-0">
                      <label className="block text-xss uppercase mb-px">Nama Batch</label>
                      <input
                        type="text"
                        className="text-sm w-full h-8 leading-tight px-2 py-1 rounded bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                        value={batchCopy.title}
                        autoFocus={true}
                        onChange={e => setBatchCopy(p => ({...p, ['title']: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-2 pr-6 sm:px-0">
                      <label className="block text-xss uppercase mb-px">Tanggal</label>
                      <input
                        type="date"
                        className="text-sm w-full h-8 leading-tight px-2 py-1 rounded bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                        value={batchCopy.date1}
                        placeholder="dd-mm-yyyy"
                        onChange={e => setBatchCopy(p => ({...p, ['date1']: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-5 pr-6 sm:px-0 pt-1">
                      <div className="flex">
                        <div className="flex-grow">
                          <button
                            className="text-xs rounded-sm borders h-6 px-4 mr-3 font-medium bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
                            onClick={updateBatch}
                          >Save</button>
                          {!b.protected && (
                            <button
                              className="text-xs rounded-sm border border-red-300 hover:border-red-400 h-6 px-2 font-medium text-red-400"
                              onClick={e => deleteBatch(e, b._id)}
                            >Delete</button>
                          )}
                          {b.protected && (
                            <button
                              value={b._id}
                              className="text-xs rounded-sm border h-6 px-2 font-medium text-gray-400"
                            >Delete</button>
                          )}
                        </div>
                        <div className="">
                        <button
                          className="text-xs rounded-sm border border-gray-300 hover:border-gray-400 h-6 px-2 font-medium text-gray-500"
                          onClick={e => setVStack(null)}
                        >Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="w-20 px-2 py-3">&nbsp;</td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  )
}