import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CSVReader } from "react-papaparse";
import { XIcon } from "@heroicons/react/solid";

import { generatePOSTData, getCurrentBatch, isAdmin } from "lib/utils";
import { APIROUTES } from "config/routes";
import NoPersonae from "./NoPersonae";
import useModules from "hooks/useModules";

import { TableCSV } from "./TableCSV";
import fetchJson from "lib/fetchJson";
import PostModal from "components/PostModal";
import { mutate } from "swr";

const buttonRef = React.createRef()

export default function ImportCSV({ user, project }) {
  const router = useRouter();
  const currentBatch = getCurrentBatch(project);
  const replace = currentBatch.personae > 0;

  const { modules, isError, isLoading } = useModules();

  const [warning, setWarning] = useState(true);
  const [testIds, setTestIds] = useState([]);
  const [simIds, setSimIds] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const [personaData, setPersonaData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [hashing, sethashing] = useState(false);
  const [hashingFlag, setHashingFlag] = useState(false);

  async function handleSubmit(e) {
    setSubmitting(true);

    // const body = { personae: personaData };
    const res = await fetchJson(APIROUTES.POST.SAVE_CSV_DATA,
      generatePOSTData({
        bid: currentBatch._id,
        data: personaData,
        replace: replace,
      })
    );

    // if (res) {
      mutate(`${APIROUTES.GET.BATCH_PERSONAE}&bid=${currentBatch._id}`)
      setSubmitting(false);
      router.push(`/projects/${project._id}/persona`)
    // }
  }

  function handleOnFileLoad(data) {
    populate(data)
  }

  function handleOnError(err, file, inputElem, reason) {
    console.log(err);
  }

  function handleOnRemoveFile(data) {
    reset()
    console.log(data);
  }

  function handleOpenDialog (e) {
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  function handleRemoveFile(e) {
    document.querySelectorAll('input[type="checkbox]').forEach(elm => {
      elm.checked = true
    })

    document.querySelectorAll('.col-email, .col-gender, .col-birth, .col-phone, .col-nip, .col-position').forEach(elm => {
      elm.classList.remove('hidden')
    })

    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  }

  function populate (data) {
    setCsvData(data)
  }

  function reset () {
    setCsvData(null)
    setPersonaData([])
  }

  // Collect module ids from batch
  useEffect(() => {
    if (!modules) return;

    const tests = [];
    const sims = [];
    modules.forEach(mod => {
      if (currentBatch.modules.includes(mod._id)) {
        // let obj = {};
        // Tests and sims format
        // <moduleId>: [ <module.lngth>, 0 ]
        // "608b29105959bf263a6ecce0": [ 45, 0 ]
        // obj[mod._id] = [mod.length, 0];
        if (mod.method == 'selftest') {
          tests.push(mod._id);
        } else if (mod.method == 'guided') {
          sims.push(mod._id);
        }
      }
    })

    setTestIds(tests);
    setSimIds(sims);

    return () => {}
  }, [modules])

  useEffect(() => {
    if (csvData && csvData.length > 1) {
      let array = []
      csvData.forEach(({ data }, index) => {
        if (data.length == 10 && data[0] && data[0].toLowerCase() !== 'fullname') {
          array.push({
            _id: null,
            lid: user.license._id,
            pid: project._id,
            bid: currentBatch._id,
            disabled: false,
            fullname: data[0].trim(),
            username: data[1].trim().toLowerCase(),
            email: data[2].trim().toLowerCase(),
            gender: data[3].trim(),
            birth: data[4].trim(),
            phone: data[5].trim(),
            nip: data[6].trim(),
            position: data[7].trim(),
            currentLevel: data[8].trim(),
            targetLevel: data[9].trim(),
            group: null,
            tests: testIds,
            sims: simIds,
            workingOn: null,
            // currentSim: null,
            // testsPerformed: [],
            // simsPerformed: [],
            xfpwd: null,
            hashed_password: null,
            creator: user.username,
            // date will be generated on server
            // created: new Date(),
            // updated: null,
          })
        }
      })

      setPersonaData(array)
      setHashingFlag(!hashingFlag)
    } else {
      setPersonaData([])
    }
    return () => {}
  }, [csvData]);

  if (isLoading) return <>...</>;

  return (
    <div className="">
      {warning && (
        <div className="bg-yellow-300 flex items-start p-2 -mt-px">
          <p className="flex-grow pl-2">
            Data peserta yang diimport dari file CSV akan menggantikan seluruh
            data peserta dalam batch.
          </p>
          <button onClick={e => setWarning(false)}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* <div className="flex items-center space-x-4 py-3 mb-4">
        <p className="flex-grow font-bold">
          Daftar peserta dalam Batch {currentBatch.title}
        </p>
        <div className="flex space-x-3 text-xs">
          <Link href={`/projects/${project._id}/setup-modules`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Add</a>
          </Link>
          <Link href={`/projects/${project._id}/setup-modules`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Import CSV</a>
          </Link>
        </div>
      </div> */}

      {/* <p>{replace ? 'Replace' : 'New'}</p> */}

      <div className="pt-4">
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          noClick
          noDrag
          noProgressBar
          onRemoveFile={handleOnRemoveFile}
        >
          {({ file }) => (
            <>
            {/* flex flex-row items-center space-x-5 pb-4 */}
            <div className="grid grid-cols-6 gap-4 pb-4">
              <div className="col-span-3 ">
                <div className="flex items-center">
                  <div className="flex-grow bg-white border border-gray-300 text-sm px-2 py-1">
                    {(file && file.name) || '...'}
                  </div>
                  {personaData.length == 0 && <button
                    type="button"
                    disabled={submitting}
                    onClick={handleOpenDialog}
                    className="bg-white whitespace-nowrap text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    Pilih file
                  </button>}
                  {personaData.length > 0 && <button
                    type="button"
                    disabled={submitting}
                    onClick={handleRemoveFile}
                    className="bg-white inline-flex text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    Remove
                  </button>}
                </div>
              </div>
              <div className="col-span-3">
                <div className="flex justify-end">
                  {/* {personaData.length == 0 && <button
                    disabled
                    className="bg-white inline-flex text-sm px-3 py-1 text-gray-400 rounded border border-gray-300"
                  >
                    Save<span className="hidden sm:inline"> CSV Data</span>
                  </button>} */}
                  {personaData.length > 0 && <button
                    type="button"
                    disabled={submitting || personaData.length == 0}
                    onClick={handleSubmit}
                    className="bg-white inline-flex text-sm px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    Save<span className="hidden sm:inline"> CSV Data</span>
                  </button>}
                  <button
                    type="button"
                    onClick={e => {
                      router.push(`/projects/${project._id}/persona`)
                    }}
                    className="bg-white inline-flex text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            </>
          )}
        </CSVReader>
      </div>

      <div className="relative overflow-x-scroll border border-gray-400">
        <TableCSV data={personaData} />
      </div>

      <div className="flex items-start space-x-2">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <pre>{JSON.stringify(currentBatch, null, 2)}</pre>
        <pre>{JSON.stringify(testIds, null, 2)}</pre>
        <pre className="w-28">{JSON.stringify(modules[0], null, 2)}</pre>
      </div>

      {submitting && <PostModal message="Uploading data... " />}

    </div>
  )
}