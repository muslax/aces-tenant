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



    {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}

  </>;
}
