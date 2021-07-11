import { useEffect, useState } from "react";
import Link from "next/link";

import { PencilAltIcon, TrashIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";

import { generatePOSTData, getCurrentBatch, isAdmin } from "lib/utils";
import useBatchPersonae from "hooks/useBatchPersonae";

import NoPersonae from "./NoPersonae";
import PostModal from "components/PostModal";
import { async } from "regenerator-runtime";
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";
import FixedOverlay from "components/FixedOverlay";

export default function Personae({ user, project }) {
  const currentBatch = getCurrentBatch(project);
  const { personae, isError, isLoading, mutate } = useBatchPersonae(
    currentBatch._id,
    'fullname, username, email, gender, birth, phone, group, nip, position, currentLevel, targetLevel'
  );

  const [persons, setPersons] = useState([]);
  const [viewStack, setViewStack] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (personae) {
      const copy = [];
      let n = 1;
      personae.forEach(p => {
        copy.push({...p, order: n });
        n++;
      })

      setPersons(copy);
    }
  }, [personae])

  if (isLoading) return null;

  if (personae.length == 0) return <NoPersonae project={project} isAdmin={isAdmin} />

  // Error: Rendered more hooks than during the previous render.
  // useEffect(() => {
  //   if (personae) {
  //     const copy = [];
  //     let n = 1;
  //     personae.forEach(p => {
  //       copy.push({...p, order: n });
  //       n++;
  //     })

  //     setPersons(copy);
  //   }
  // }, [personae])

  function showRow(e, id) {
    setViewStack(vs => ([...vs, id]));
  }

  function hideRow(e, id) {
    setViewStack(viewStack.filter(item => item !== id))
  }

  async function deletePersona(e) {
    const body = generatePOSTData({ id: toDelete._id });
    setToDelete(null);
    setModal('Deleting...');
    const res = await fetchJson(APIROUTES.POST.DELETE_PERSONA, body);
    if (res) {
      mutate();
      setModal(null);
    }
  }



  return (
    <div className="">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow flex items-center">
          <input
            type="text"
            className={`text-sm w-full h-8 leading-tight pl-16 pr-3 rounded bg-gray--50
            border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100`}
            onChange={e => setFilter(e.target.value.toLowerCase())}
          />
          <div className="absolute top-0 left-0 h-8 py-px text-xs text-gray-500 leading-none">
            <span className="flex items-center h-8 px-2 pb-px border-r">Search:</span>
          </div>
        </div>
        <div className="flex space-x-3 text-xs">
          {/* <Link href={`#`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Add</a>
          </Link> */}
          {isAdmin(user, project) && <Link href={`/projects/${project._id}/import-csv`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Import CSV</a>
          </Link>}
        </div>
      </div>


      <table className="w-full">
        <tbody className="text-xs text-gray-500">
          <tr className="border-b border-gray-300">
            <td className="px-2 pb-2">#</td>
            <td className="px-2 pb-2">Nama</td>
            {/* <td className="px-2 pb-2">Grup</td> */}
            <td className="px-2 pb-2">NIP / ID</td>
            {/* <td className="hidden md:table-cell px-2 pb-2">Jabatan</td> */}
            {/* <td className="hidden md:table-cell px-2 pb-2">Level Sekarang</td> */}
            {/* <td className="hidden md:table-cell px-2 pb-2">Level Target</td> */}
            <td className="px-2 pb-2">&nbsp;</td>
          </tr>
        </tbody>

        {persons.filter(person => person.fullname.toLowerCase().includes(filter)).map((p, index) => (
        <tbody key={p._id}>
          {!viewStack.includes(p._id) && (
            <tr className="border-b hover:bg-gray-50">
              <td onClick={e => showRow(e, p._id)} className="w-10 p-2 text-center">{p.order}</td>
              <td onClick={e => showRow(e, p._id)} className="p-2 whitespace-nowrap cursor-pointer">{p.fullname}</td>
              {/* <td width="30" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer">{p.group || <span className="text-gray-400">...</span>}</td> */}
              <td width="" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer">{p.nip || <div className="text-centertext-gray-400">-</div>}</td>
              {/* <td width="" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer hidden md:table-cell ">{p.position || <span className="text-gray-400">-</span>}</td> */}
              {/* <td width="" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer hidden md:table-cell">{p.currentLevel || <span className="text-gray-400">-</span>}</td> */}
              {/* <td width="" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer hidden md:table-cell">{p.targetLevel || <span className="text-gray-400">-</span>}</td> */}
              <td className="w-10 px-2 py-0">
                <div className="flex items-center h-6 pl-2 pr-1 border-l">
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={e => setToDelete(p)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
              </td>
            </tr>
          )}

          {viewStack.includes(p._id) && <>
            <tr
              className="bg-gray-50 hover:bg-gray-100 border-b cursor-pointer"
              onClick={e => hideRow(e, p._id)}
            >
              <td className="w-10 p-2 text-center">{index +1}</td>
              <td colSpan="3" className="p-2 whitespace-nowrap">{p.fullname}</td>
            </tr>
            <tr className="border-b bg-gray-50 bg-opacity-50">
              <td className="w-10 p-2 text-center">&nbsp;</td>
              <td colSpan="3" className="px-2 py-0">
                <PersonDetail
                  person={p}
                  mutate={mutate}
                  callback={() => setViewStack(viewStack.filter(item => item !== p._id))}
                  setModal={setModal}
                />
              </td>
            </tr>
          </>}
        </tbody>
      ))}
      </table>

      {/* <pre>{JSON.stringify(currentBatch, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(viewStack, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(personae[0], null, 2)}</pre> */}

      {modal && <PostModal message={modal} />}

      {toDelete && (
        <FixedOverlay>
          <div className="w-3/5 sm:w-80 rounded bg-yellow-200 border border-white shadow-md">
            <div className="flex items-center space-x-3 rounded-t bg--red-300 pl-3 pr-2 py-1">
              <div className="flex-grow">
                Delete {toDelete.fullname}?
              </div>
              <button className=""
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-b bg-gray-50 border-t border-yellow-300 px-5 py-10 text-center">
              <button
                onClick={deletePersona}
              >OK, Delete</button>
            </div>
          </div>
        </FixedOverlay>
      )}
    </div>
  )
}

function PersonDetail({ person, mutate, setModal, callback }) {
  const [personData, setPersonData] = useState({
    id: person._id,
    fullname: person.fullname,
    gender: person.gender,
    birth: person.birth,
    email: person.email,
    nip: person.nip,
    position: person.position,
    currentLevel: person.currentLevel,
    targetLevel: person.targetLevel,
  })

  const inputClass = `text-xs w-full rounded border-gray-300 h-7 px-2 py-0
  hover:border-blue-300 focus:border-blue-400
  focus:ring-blue-100 focus:ring-2`;

  async function updatePerson(e) {
    setModal('Updating...')

    const res = await fetchJson(
      APIROUTES.POST.UPDATE_PERSONA,
      generatePOSTData(personData)
    )

    if (res) {
      mutate();
      setModal(null);
      callback();
    }
  }

  return <>
    <div className="pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 py-1">
        <table className="w-full text-xs">
          <tbody>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Nama lengkap:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="fullname"
                  onChange={e => setPersonData(p => ({...p, fullname: e.target.value}))}
                  defaultValue={personData.fullname}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Jenis kelamin:</td>
              <td className="p-1">
                <select
                  className={`text-xs w-full rounded border-gray-300 h-7 px-2 py-0
                  hover:border-blue-300 focus:border-blue-400
                  focus:ring-blue-100 focus:ring-2`}
                  defaultValue={personData.gender}
                  name="gender"
                  onChange={e => setPersonData(p => ({...p, gender: e.target.value}))}
                >
                  <option>- Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Tanggal lahir:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="birth"
                  onChange={e => setPersonData(p => ({...p, birth: e.target.value}))}
                  defaultValue={personData.birth}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Email:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="email"
                  onChange={e => setPersonData(p => ({...p, email: e.target.value}))}
                  defaultValue={personData.email}
                  className={inputClass}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full text-xs">
          <tbody>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">NIP / NIK:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="nip"
                  onChange={e => setPersonData(p => ({...p, nip: e.target.value}))}
                  defaultValue={personData.nip}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Jabatan:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="position"
                  onChange={e => setPersonData(p => ({...p, position: e.target.value}))}
                  defaultValue={personData.position}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Level sekarang:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="currentLevel"
                  onChange={e => setPersonData(p => ({...p, currentLevel: e.target.value}))}
                  defaultValue={personData.currentLevel}
                  className={inputClass}
                />
              </td>
            </tr>
            <tr className="">
              <td className="w-28 whitespace-nowrap p-1 pl-0">Level target:</td>
              <td className="p-1">
                <input
                  type="text"
                  name="targetLevel"
                  onChange={e => setPersonData(p => ({...p, targetLevel: e.target.value}))}
                  defaultValue={personData.targetLevel}
                  className={inputClass}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="col-span-1 md:col-span-2 text-center border-t pt-3 pb-4">
        <button
          className={`rounded-sm bg-green-400 hover:bg-green-500 active:bg-green-600 text-white h-7 px-5 text-xs font-bold`}
          onClick={updatePerson}
        >Save</button>
      </div>
    </div>
  </>
}