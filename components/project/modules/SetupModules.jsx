import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { generatePOSTData, getCurrentBatch } from "lib/utils";
import useModules from "hooks/useModules";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";
import PostModal from "components/PostModal";


export default function SetupModules({ user, modules, project, batch, mutate }) {
  const router = useRouter();
  // const batch = getCurrentBatch(project);
  // const { modules, isError, isLoading } = useModules();

  const [prevSelection, setPrevSelection] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [selection, setSelection] = useState(batch.modules);
  const [orderedSelection, setOrderedSelection] = useState([]);
  const [cognitives, setCognitives] = useState([]);
  const [flag, setFlag] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // if (isLoading || isError) return null;

  useEffect(() => {
    const array = [];
    modules.forEach(m => {
      if (m.domain == 'Cognitive' && batch.modules.includes(m._id)) {
        array.push(m._id);
        if (m.type == "MATE") setFlag(m.type);
        else setFlag(m.domain);
      }
    })

    setCognitives(array);
  }, [modules, batch])

  // Create ordered selection based on module's order property
  useEffect(() => {
    if (!modules) {
      setOrderedSelection(selection);
      return;
    }

    let array = [];
    modules.forEach(m => {
      if (selection.includes(m._id)) {
        array.push({
          _id: m._id,
          order: m.order,
        })
      }
    });

    array.sort((a, b) => {
      if (a.order > b.order) return 1;
      else if (a.order < b.order) return -1;
      return 0;
    })

    let ordered = []
    array.forEach(({ _id }) => {
      ordered.push(_id);
    })

    setOrderedSelection(ordered);

    return () => {}
  }, [selection])

  // Warning: Maximum update depth exceeded. This can happen when a component
  // calls setState inside useEffect, but useEffect either doesn't have a
  // dependency array, or one of the dependencies changes on every render.
  // useEffect(() => {
  //   if (!modules) return;

  //   setSelection(batch.modules)

  //   modules.forEach(m => {
  //     if (batch.modules.includes(m._id)) {
  //       if (m.type == "MATE") {
  //         setFlag(m.type);
  //         setCognitives(s => ([...s, m._id]))
  //       } else if (m.domain == "Cognitive") {
  //         setFlag(m.domain);
  //         setCognitives(s => ([...s, m._id]))
  //       }
  //     }
  //   })
  // }, [batch])

  function checkFlag(domain, type) {
    if (type == "MATE" && flag == "Cognitive") return true;
    if (type != "MATE" && domain == "Cognitive" && flag == "MATE") return true;
    return false;
  }

  function getClass(domain, type) {
    if (type == "MATE") return type;
    if (type != "MATE" && domain == "Cognitive") return domain;
    return "";
  }

  function changeHandler(e, m) {
    const isMate = m.type == 'MATE';
    const isCognitive = m.type != 'MATE' && m.domain == 'Cognitive';

    if (e.target.checked) {
      setSelection(s => ([...s, m._id]))

      if (isMate) setFlag(m.type)
      else if (isCognitive) setFlag(m.domain)

      if (isMate || isCognitive) setCognitives(s => ([...s, m._id]))
    }
    else {
      if (isMate || isCognitive) {
        setCognitives(cognitives.filter((s) => {return s != m._id}))

        if (isMate && flag == 'MATE') setFlag(null);
        if (isCognitive && flag == 'Cognitive' && cognitives.length == 1) {
          setFlag(null);
        }
      }

      setSelection(selection.filter((s) => {return s != m._id}))
    }
  }

  async function saveBatchModules(e) {
    setSubmitting(true);

    const res = await fetchJson(APIROUTES.POST.SAVE_MODULES, generatePOSTData({
      id: batch._id,
      modules: orderedSelection,
    }))

    if (res) {
      mutate();
      router.push(`/projects/${project._id}/modules`);
    }
  }

  // if (isLoading || isError) return null;

  return (
    <div className="">
      <div className="flex items-center space-x-4 py-3 mb-4">
        <p className="flex-grow font-bolds pt-1">
          Silakan pilih mana yang disuka.
        </p>
        {/* <div className="h8">&nbsp;</div> */}
      </div>

      <div className="flex items-center space-x-4 mb-3">
        <div className="flex-grow pt-2">
        {showDescription && <button
            className="flex items-center text-blue-500"
            onClick={e => setShowDescription(!showDescription)}
          >
            <span>Hide description</span>
            <ChevronDownIcon className="w-5 h-5" />
          </button>}
          {!showDescription && <button
            className="flex items-center text-blue-500"
            onClick={e => setShowDescription(!showDescription)}
          >
            <span>Show description</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>}
        </div>
        <div className="text-xs">
          <Link href={`/projects/${project._id}/modules`}>
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-red-400">Cancel</a>
          </Link>
        </div>
      </div>



      <div className="border-t border-gray-300">
      {modules.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        return 0;
      }).map(m => (
        <div
          key={m._id}
          className="flex items-start space-x-4 border-b px-2 py-2"
        >
          <div className="flex-shrink-0 flex space-x-3 py-px">
            {batch.modules.length > 0 && <input
              type="checkbox"
              checked={batch.modules.includes(m._id)}
              disabled
              className="w-5 h-5 rounded border-gray-200 border-gray-400 hover:border-gray-500
              text-gray-200 focus:ring-blue-200 focus:ring-offset-1"
            />}
            <input
              type="checkbox"
              id={m._id}
              disabled={checkFlag(m.domain, m.type)}
              defaultChecked={batch.modules.includes(m._id)}
              className={`${getClass(m.domain, m.type)}
              w-5 h-5 rounded border-gray-400 hover:border-gray-500
              text-green-500 focus:ring-blue-200 focus:ring-offset-1`}
              onChange={(e) => changeHandler(e, m)}
            />
          </div>

          <div className={`flex-grow
              ${checkFlag(m.domain, m.type) ? 'text-gray-400' : ''}`}>
            <label
              htmlFor={m._id}
              className={`${checkFlag(m.domain, m.type)
              ? '' : 'hover:text-blue-500'} font-bold cursor-pointer`}
            >{m.title}</label>
            {showDescription && <div className="mt-1">{m.description}</div>}
          </div>
        </div>
      ))}
      </div>

      <div className="text-center pt-10">
        <button
          className="inline-flex font-semibold text-white rounded-sm bg-green-500 hover:bg-green-600 active:bg-green-700 px-5 py-2"
          onClick={saveBatchModules}
        >Save Modules</button>
      </div>

      <div className="flex items-start space-x-5 mt-10">
        <pre>BATCH MODULES {JSON.stringify(batch.modules, null, 2)}</pre>
        <pre>SELECTIONS {JSON.stringify(selection, null, 2)}</pre>
        <pre>ORDERED {JSON.stringify(orderedSelection, null, 2)}</pre>
        <pre>COGNITIVES {JSON.stringify(cognitives, null, 2)}</pre>
      </div>

      {/* <pre>MODULES {JSON.stringify(modules, null, 2)}</pre> */}

      {submitting && <PostModal message="Saving ACES Modules ..." />}
    </div>
  )
}