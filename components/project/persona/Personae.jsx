import { useEffect, useState } from "react";
import Link from "next/link";

import { PencilAltIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";

import { generatePOSTData, getCurrentBatch, isAdmin } from "lib/utils";
import useBatchPersonae from "hooks/useBatchPersonae";

import NoPersonae from "./NoPersonae";
import PostModal from "components/PostModal";
import { async } from "regenerator-runtime";
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";
import FixedOverlay from "components/FixedOverlay";
import { mutate } from "swr";

const prefetchFields='fullname,username,email,gender,birth,phone,group,nip,position,currentLevel,targetLevel';

export default function Personae({ user, project }) {
  const currentBatch = getCurrentBatch(project);
  const { personae, isError, isLoading, mutate: mutatePersonae } = useBatchPersonae(
    currentBatch._id,
    prefetchFields
  );

  const [persons, setPersons] = useState([]);
  const [form, setForm] = useState(false);
  const [rawNames, setRawNames] = useState("");
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
  // }, [])

  function getList() {
    return persons.filter(person => person.fullname.toLowerCase().includes(filter));
  }

  function showRow(e, id) {
    if (!form) setViewStack(vs => ([...vs, id]));
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
      mutatePersonae();
      setModal(null);
    }
    mutate(`${APIROUTES.GET.PROJECT}&pid=${project._id}`);
  }

  async function saveNames(e) {
    const raws = rawNames.split("\n");
    const names = [];
    raws.forEach(r => { if (r.trim().length > 2) names.push(r.trim()) })

    if (names.length == 0) return;

    setModal('Processing...');

    const res = await fetchJson(APIROUTES.POST.ADD_NAMES, generatePOSTData({
      pid: project._id,
      bid: currentBatch._id,
      tests: personae[0].tests, // Just take from first person
      sims: personae[0].sims,   //
      names: names,
    }))

    mutatePersonae();
    mutate(`${APIROUTES.GET.PROJECT}&pid=${project._id}`);
    setForm(false);
    setRawNames("");
    setModal(null);
  }

  return (
    <div className="">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow flex items-center">
          <input
            type="text"
            disabled={form}
            value={filter}
            className={`text-sm w-full h-8 leading-tight pl-16 pr-3 rounded bg-gray--50
            border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100`}
            onChange={e => setFilter(e.target.value.toLowerCase())}
            onKeyDown={e => {
              if (e.keyCode === 27) setFilter("")
            }}
          />
          <div className="absolute top-0 left-0 h-8 py-px text-xs text-gray-500 leading-none">
            <span className="flex items-center h-8 px-2 pb-px border-r">Search:</span>
          </div>
          <button
            disabled={form}
            className="absolute top-1 right-2 pt-px text-gray-300 hover:text-gray-400"
            onClick={e => setFilter('')}
          >
            <XCircleIcon className="w-5 h-5 "/>
          </button>
        </div>
        <div className="flex space-x-3 text-xs">
          <button
            className="button-trigger px-2"
            onClick={e => {
              if (!form) {
                setForm(true);
                setViewStack([]);
              }
            }}
          >Add</button>
          {isAdmin(user, project) && <Link href={`/projects/${project._id}/import-csv`}>
            <a
              disabled={form}
              className="button-trigger px-3"
            >Import CSV</a>
          </Link>}
        </div>
      </div>

      {form && (
      <div className="mb-4">
        <p className="font--light mb-1">
          Masukkan satu atau lebih nama lengkap. Setiap baris mewakili satu nama.
        </p>
        <textarea
          rows={4}
          autoFocus
          value={rawNames}
          onChange={e => setRawNames(e.target.value)}
          className={`w-full rounded border border-gray-300 text-sm px-3 py-2
          border-gray-300 focus:bg-white focus:border-blue-300 focus:ring-blue-100
          `}
        ></textarea>
        <div className="pt-2 flex items-center justify-center space-x-3">
          <button
            className={`rounded text-xs font-bold text-white px-5 h-8
            bg-green-500 hover:bg-green-600 focus:border--blue-300 focus:outline-none
            focus:ring-1 focus:ring-offset-1 focus:ring-green-400`}
            onClick={saveNames}
          >Save Names</button>
          <button
            className={`rounded text-xs font-medium text-gray-500 hover:text-red-400 px-5 h-8
          border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-none`}
          onClick={e => setForm(false)}
          >Cancel</button>
        </div>
      </div>
      )}

      <div className="border-b pb-3">
        {getList().length > 0 && (
          <span className="text-gray-500">
            Daftar nama dan nomor induk. Klik setiap baris untuk menampilkan
            atau mengedit.
          </span>
        )}
        {getList().length == 0 && (
          <span className="text-red-400">
            Tidak menemukan nama peserta dengan keyword di atas.
          </span>
        )}
      </div>
      <table className="w-full border--t">

        {getList().map((p, index) => (
        <tbody key={p._id}>
          {!viewStack.includes(p._id) && (
            <tr className="border-b hover:bg-gray-50">
              <td onClick={e => showRow(e, p._id)} className="w-10 p-2 text-center">{p.order}</td>
              <td onClick={e => showRow(e, p._id)} className="p-2 whitespace-nowrap cursor-pointer">{p.fullname}</td>
              {/* <td width="" onClick={e => showRow(e, p._id)} className="text-xs p-2 whitespace-nowrap cursor-pointer">{p.nip || <div className="text-centertext-gray-400">-</div>}</td> */}
              <td
                onClick={e => showRow(e, p._id)}
                className="w-20 sm:w-32 text-xs p-2 whitespace-nowrap cursor-pointer"
              >
                <div className="w-20 sm:w-32 text-gray-400 truncate">
                  {p.nip ? p.nip : '-'}
                </div>
              </td>
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
              <td className="w-10 p-2 text-center">{p.order}</td>
              <td colSpan="3" className="p-2 whitespace-nowrap">{p.fullname}</td>
            </tr>
            <tr className="border-b bg-gray-50 bg-opacity-50">
              <td className="w-10 p-2 text-center">&nbsp;</td>
              <td colSpan="3" className="px-2 py-0">
                <PersonDetail
                  person={p}
                  mutate={mutatePersonae}
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
              <button className="" onClick={e => setToDelete(null)}
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