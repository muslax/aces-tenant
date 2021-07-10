import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";

import fetchJson from "lib/fetchJson";

import { APIROUTES } from "config/routes";
import { generatePOSTData, getCurrentBatch, range } from "lib/utils";
import { createGroupsMeta } from 'lib/grouping';
import useBatchGroups from "hooks/useBatchGroups";
import useBatchPersonae from "hooks/useBatchPersonae";

import PostModal from "components/PostModal";
import PersistedGroups from "./PersistedGroups";
import RuntimeGroups from "./RuntimeGroups";
import Schedule from "./Schedule";

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

function computeGroups(persons, meta) {
  let start = 0;
  let array = [];
  const grouping = meta.grouping;

  for (let i = 0; i < grouping.length; i++) {
    const idx = i + 1;
    const sfx = idx < 10 ? '0' + idx : idx;
    const groupName = `GRUP ${sfx}`;
    if (i == grouping.length - 1) {
      array.push({
        name: groupName,
        persons: persons.slice(start)
      });
    } else {
      array.push({
        name: groupName,
        persons: persons.slice(start, start + grouping[i])
      });
    }

    start = start + grouping[i];
  }

  return array;
}

function computeSchedules(population) {
  const len = population.length;
  const meta = createGroupsMeta(len);
  const groups = computeGroups(population, meta);

  const schedules = groups.map(({ name, persons }, index) => {
    return {
      name: name,
      persons: persons,
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
      norm: meta.norm,
    }
  })

  const div = Math.ceil(groups.length / 4);
  const divSlots = [];
  /* Always create 4 slot combinations */
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'interview', slot2: 'discussion', slot3: 'selftest', slot4: 'selftest'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'discussion', slot2: 'interview', slot3: 'selftest', slot4: 'selftest'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'selftest', slot2: 'selftest', slot3: 'interview', slot4: 'discussion'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'selftest', slot2: 'selftest', slot3: 'discussion', slot4: 'interview'});

  for (let i = 0; i < schedules.length; i++) {
    const slot = divSlots[i];
    const asw = slot.asw;
    if (schedules[i].persons < schedules[i].norm) asw  = divSlots[i].asw + ' (-)';
    if (schedules[i].persons > schedules[i].norm) asw  = divSlots[i].asw + ' (+)';
    schedules[i].slot1 = slot.slot1;
    schedules[i].slot2 = slot.slot2;
    schedules[i].slot3 = slot.slot3;
    schedules[i].slot4 = slot.slot4;
    schedules[i].asd = slot.asd;
    schedules[i].asw = asw;
    // schedules[i].norm = pop;
  }

  return schedules;
}

function generateSchedulesData(batch, slots, schedules) {
  const body = {
    batch: {
      _id: batch._id,
      order: 1,
      timing: "slot",
      slot1: slots[0],
      slot2: slots[1],
      slot3: slots[2],
      slot4: slots[3],
    },
    groups: [],
  }

  schedules.forEach(g => {
    const persons = [];
    g.persons.forEach(p => { persons.push(p._id) })
    body.groups.push({
      _id: null,
      bid: batch._id,
      name: g.name,
      persons: persons,
      slot1: g.slot1,
      slot2: g.slot2,
      slot3: g.slot3,
      slot4: g.slot4,
      asd: g.asd,
      asw: g.asw,
    })
  })

  return body;
}

function dummy() {
  const body = {
    batches: [
      { id: 111, persons: [] }
    ],
    persons: [
      { id: 333, group: 455 },
      { id: 333, group: 456 },
    ]
  }
}

export default function Deployment({ user, project, mutate }) {
  const [currentBatch, setCurrentBatch] = useState(getCurrentBatch(project));

  const { groups, isError, isLoading, mutate: mutateGroups } = useBatchGroups(currentBatch._id);
  const { personae, isError: pError, isLoading: pLoading } = useBatchPersonae(currentBatch._id, 'fullname, group');

  const [schedules, setSchedules] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [groupsMeta, setGroupsMeta] = useState(null);

  const [date2, setDate2] = useState(null);
  const [timing, setTiming] = useState("slot");


  useEffect(() => {
    if (personae && personae.length > 0) {
      setSchedules(computeSchedules(personae));
      setGroupsMeta(createGroupsMeta(personae.length));

      // Usernames
      const names = {};
      personae.forEach(p => {
        names[p._id] = p.fullname;
      })

      // setUsernames(names);
    }
  }, [personae])

  useEffect(() => {
    setCurrentBatch(getCurrentBatch(project));
  }, [project])

  useEffect(() => {
    if (timing == "2" || timing == "3") {
      const duration = timing == "2" ? 1 : 2;
      const wibStr = `${currentBatch.date1} 23:00`;
      // const d1 = dayjs(currentBatch.date1);
      const d1 = dayjs(wibStr).tz('Asia/Jakarta');
      const d2 = d1.add(duration, 'd');
      const d2Str = d2.toISOString().substr(0, 10);
      // alert(d2.toISOString().substr(0, 10));
      setDate2(d2Str);
    } else {
      setDate2("");
    }
  }, [timing])

  if (isError || pError || isLoading || pLoading) return "ERROR";

  async function saveDeployment(e) {

    setSubmitting(true);
    const body = generateSchedulesData(currentBatch, ['08.00', '10.00', '13.00', '15.00'], schedules);
    await fetchJson(APIROUTES.POST.SAVE_DEPLOYMENT, generatePOSTData(body));
    setSubmitting(false);
    mutateGroups();
  }

  return (
    <div className="">
      <div className="flex items-center space-x-4 py-3">
        <p className="flex-grow text-bases font--bold">
          Point-point deployment {currentBatch.title}
        </p>
        <div className="text-xs">
            <a className="inline-flex items-center h-7 rounded-sm border px-3 py-1- text-blue-500">Button</a>
        </div>
      </div>

      <table className="w-full">
        <tbody>
          <tr><td width="17%"></td><td></td></tr>

          <tr className="">
            <td colSpan="2" className="pt-5 pb-2 font-bold">
              <h4 className="border-b border-gray-300 pb-2">Test online mandiri</h4>
            </td>
          </tr>
          <tr className="border--t">
            <td className="py-2">Token batch:</td>
            <td className="p-0 pb-1">
              <input type="text" value="yw-9kh" readOnly
                className="text-sm h-8 w-20 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              />
            </td>
          </tr>
          <tr className="border--t">
            <td className="py-2">Urutan tes:</td>
            <td className="p-0 pb--1 h-10">
              <select type="text"
                className="text-sm h-8 leading-tight pl-2 pr-10 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              >
                <option value="1">Urut</option>
                <option value="0">Bebas</option>
              </select>
              <select type="text"
                className="text-sm bg-none ml-2 h-8 leading-tight pl-2 pr-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              >
              {(range(1, 31)).map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </td>
          </tr>
          <tr className="border--t">
            <td className="py-2">Waku tes:</td>
            <td className="p-0 h-10">
              <select type="text"
                className="text-sm h-8 leading-tight pl-2 pr-10 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                onChange={e => setTiming(e.target.value)}
              >
                <option value="slot">Sesuai jadwal</option>
                <option value="date1">Sepanjang hari</option>
                <option value="2">2 hari</option>
                <option value="3">3 hari</option>
              </select>
              <input type="text" readOnly value={currentBatch.date1}
                className="ml-2 text-sm w-24 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              />
              <span className="ml-2">s.d.</span>
              <input type="text" readOnly value={date2}
                className="ml-2 text-sm w-24 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              />
              {/* <span className="ml-3">{timing}</span> */}
            </td>
          </tr>


          <tr className="border-">
            <td colSpan="2" className="pt-7 pb-2 font-bold">
              <h4 className="border-b border-gray-300 pb-2">Diskusi & wawancara</h4>
            </td>
          </tr>
          <tr className="border--t">
            <td className="py-2">
            Tanggal:
            </td>
            <td className="p-0">
              <input type="text" readOnly value={currentBatch.date1}
                className="text-sm h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              />
            </td>
          </tr>

          {/* <tr className="border-">
            <td colSpan="2" className="pt-7 pb-2 font-bold">
              <h4 className="border-b border-gray-300 pb-2">Pembagian slot waktu</h4>
            </td>
          </tr>
          <tr className="border--t">
            <td className="py-2">Pilihan:</td>
            <td className="p-0">
              <input type="text" readOnly
                className="text-sm h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
              />
            </td>
          </tr>
          <tr className="border--t">
            <td className="py-2">&nbsp;</td>
            <td className="p-0">
              <div className="flex space-x-1">
                <input type="text" value="08:00" readOnly
                  className="text-sm w-20 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                />
                <input type="text" value="10:00" readOnly
                  className="text-sm w-20 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                />
                <input type="text" value="13:00" readOnly
                  className="text-sm w-20 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                />
                <input type="text" value="15:00" readOnly
                  className="text-sm w-20 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                />
              </div>
            </td>
          </tr> */}
        </tbody>


      </table>

      {groups && groups.length > 0 && (
        <div>
          <h4 className="pt-7 pb-2 font-bold">Saved schedule</h4>
          <Schedule groups={groups} />

          <h4 className="pt-7 pb-2 font-bold">Saved groups</h4>
          <PersistedGroups groups={groups} />
        </div>
      )}

      {!groups || groups.length == 0 && (
        <div>
          <h4 className="pt-7 pb-2 font-bold">Tentative schedule</h4>
          <Schedule groups={schedules} tentative={true} />

          <h4 className="pt-7 pb-2 font-bold">Tentative groups</h4>
          <RuntimeGroups groups={schedules} />
        </div>
      )}




      {/* <h4 className="pt-7 pb-2 font-bold">Tentative groups</h4> */}

      {/* <RuntimeGroups groups={schedules} /> */}






      <div className="pt-7 font-bold">
        <h4 className="pb-2">Kebutuhan asesor</h4>
      </div>
      <div className="">
        Pemandu diskusi: {groupsMeta?.div}<br/>
        Interviewer: {groupsMeta?.team}<br/>
      </div>

      <div className="my-6">
      <button
        className={`inline-flex items-center h-9 rounded-sm border px-3 py-1- text-blue-500`}
        onClick={saveDeployment}
      >Save Deployment</button>
      </div>

      {/* <div className="flex space-x-5">
        <pre>BATCH {JSON.stringify(currentBatch, null, 2)}</pre>
        <pre>SAVED {JSON.stringify(groups, null, 2)}</pre>
        <pre>RUNTIME {JSON.stringify(schedules, null, 2)}</pre>
      </div> */}

      <pre>BATCH {JSON.stringify(currentBatch, null, 2)}</pre>

      {submitting && <PostModal message="Save deployment data ..." />}
    </div>
  )
}

// function
