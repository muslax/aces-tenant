import { useEffect, useState } from 'react';

import useModules from 'hooks/useModules';
import { APIROUTES } from 'config/routes';
import { generatePOSTData } from 'lib/utils';
import fetchJson from 'lib/fetchJson';
import { getCurrentBatch } from 'lib/utils';

import ProjectInfo from "./ProjectInfo";
import ActiveBatch from './ActiveBatch';
import BatchTable from './BatchTable';
import Subheading from './Subheading';
import Subhead from './Subhead';

export default function Overview({ user, project, mutate }) {
  const { modules, isLoading } = useModules();
  const [currentBatch, setCurrentBatch] = useState(getCurrentBatch(project));
  const [showInfo, setShowInfo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // setCurrentBatch(getCurrentBatch(project));

    return () => {};
  }, [project])

  useEffect(() => {
    // const key = project._id;
    // window.localStorage.setItem(key, JSON.stringify(currentBatch));
  }, [currentBatch])

  async function saveNewBatch(e) {
    if (!title || !date) return;

    await fetchJson(APIROUTES.POST.SAVE_NEW_BATCH, generatePOSTData({
      pid: project._id,
      title: title,
      date: date,
    }))

    mutate();
    setShowForm(false);
    setTitle("");
    setDate("");
  }

  function isAdmin() {
    return user.username == project.admin.username;
  }

  return <>
    <div className="flex items-center text-xs font-medium mb-4">
      {!showInfo && <>
        <span className="flex items-center h-7 rounded-l bg-gray-400 text-white px-3 cursor-default">Batch Info</span>
        <button className="flex items-center h-7 rounded-r bg-gray-200 bg-opacity-75 hover:bg-opacity-100 font-medium px-3" onClick={e => setShowInfo(true)}>Project Info</button>
      </>}
      {showInfo && <>
        <button className="flex items-center h-7 rounded-l bg-gray-200 bg-opacity-75 hover:bg-opacity-100 font-medium px-3" onClick={e => setShowInfo(false)}>Batch Info</button>
        <span className="flex items-center h-7 rounded-r bg-gray-400 text-white px-3 cursor-default">Project Info</span>
      </>}
    </div>

    {!showInfo && (
      <div className="mb-10">
        <div className="pb-2">
          <Subhead title="Active Batch">
            <select
              className="select-trigger leading-none pr-10"
              value={currentBatch._id}
              onChange={e => {
                const key = project._id;
                const batch = project.batches.filter(b => b._id == e.target.value)[0]
                console.log(batch?.title)
                window.localStorage.setItem(key, JSON.stringify(batch));
                setCurrentBatch(getCurrentBatch(project))
              }}
            >
              {project.batches.sort((a, b) => {
                if (a._id > b._id) return -1;
                else if (a._id < b._id) return 1;
                return 0;
              }).map(b =>(
                <option key={b._id} value={b._id}>{b.title}</option>
              ))}
            </select>
          </Subhead>
        </div>
        <ActiveBatch
          batch={currentBatch}
          modules={modules}
          isLoading={isLoading}
        />
      </div>
    )}

    {showInfo && (
      <div className="mb-10">
        <ProjectInfo
          user={user}
          project={project}
          mutate={mutate}
        />
      </div>
    )}

    <BatchTable
      project={project}
      currentBatch={currentBatch}
      callback={setCurrentBatch}
      editable={isAdmin()}
      mutate={mutate}
    />

    <div className="my-10">
      {!showInfo && !showForm && isAdmin() && <div className="text-center">
        <button
          className="rounded-sm border h-8 px-5 font-medium border-gray-300 hover:border-gray-400 active:border-gray-500 text-gray-600 active:text-gray-800"
          onClick={e => setShowForm(true)}
        >Create New Batch</button>
      </div>}

      {showForm && (
        <div className="flex flex-col sm:flex-rows sm:flex-wraps items-center justify-start sm:justify-center space-y-2 pr-4">

          <div className="bg-yellow-100- flex items-center justify-start">
            <label className="w-24 text-right whitespace-nowrap mr-2">Nama Batch:</label>
            <input
              type="text"
              autoFocus
              placeholder="Maks. 30 karakter"
              maxLength="30"
              className="input-project w-52" value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="bg-green-100- flex items-center justify-start">
            <label className="w-24 text-right whitespace-nowrap mr-2">Tanggal:</label>
            <input
              type="date"
              value={date}
              className="input-project w-52"
              placeholder="dd-mm-yyyy"
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-start pt-2s">
            <label className="w-24 text-right whitespace-nowrap mr-2">&nbsp;</label>
            <div className="w-52 flex space-x-3">
              <button
                className="flex-grow rounded-sm borders h-8 px-4 font-medium bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
                onClick={saveNewBatch}
              >Save</button>
              <button
                className="rounded-sm border h-8 px-4 font-medium border-gray-300 hover:border-gray-400 active:border-gray-500 text-gray-500 hover:text-gray-600 active:text-gray-700"
                onClick={e => setShowForm(false)}
              >Cancel</button>
            </div>
          </div>

          <div className="flex space-x-3 mb-4">

          </div>
        </div>
      )}
    </div>

    {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}

  </>;
}
