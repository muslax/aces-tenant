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
import Subhead from "../overview/Subhead";

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
  const [token, setToken] = useState('');
  const [order, setOrder] = useState(1);
  const [date1, setDate1] = useState(null);
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
    setToken(currentBatch.token);
    setDate1(currentBatch.date1);
    setDate2(currentBatch.date2);
    setOrder(currentBatch.order);
    setTiming(currentBatch.timing);
  }, [project])

  useEffect(() => {
    if (timing == "2" || timing == "3") {
      const duration = timing == "2" ? 1 : 2;
      const wibStr = `${date1} 23:00`;
      // const d1 = dayjs(currentBatch.date1);
      const d1 = dayjs(wibStr).tz('Asia/Jakarta');
      const d2 = d1.add(duration, 'd');
      const d2Str = d2.toISOString().substr(0, 10);
      // alert(d2.toISOString().substr(0, 10));
      setDate2(d2Str);
    } else {
      setDate2(null);
    }
  }, [timing])

  if (isError || pError || isLoading || pLoading) return <></>;

  async function saveDeployment(e) {

    setSubmitting(true);
    const body = generateSchedulesData(currentBatch, ['08.00', '10.00', '13.00', '15.00'], schedules);
    await fetchJson(APIROUTES.POST.SAVE_DEPLOYMENT, generatePOSTData(body));
    setSubmitting(false);
    mutateGroups();
  }

  async function saveTestMode(e) {
    setSubmitting(true);
    const t = timing == "2" || timing == "3" ? "date2" : timing;
    const body = {
      id: currentBatch._id,
      order: order,
      timing: t,
      date1: date1,
      date2: date2,
    }
    console.log(body)
    await fetchJson(APIROUTES.POST.SAVE_TEST_MODE, generatePOSTData(body));
    mutate();
    setSubmitting(false);
  }

  const testTiming = {
    slot:  'Hanya dapat diakses pada jam sesuai jadwal.',
    date1: 'Dapat diakses mulai pagi hingga Pukul 23.00 WIB.',
    2: 'Dapat diakses hingga Pukul 23.00 tanggal ',
    3: 'Dapat diakses hingga Pukul 23.00 tanggal ',
  }

  return (
    <div className="-mt-2">
      <div className="border-b pb-2 mb-3">
        <Subhead title="Settings"></Subhead>
      </div>

      <div className="max-w-=2xl grid grid-cols-11 gap-0">
        <div className="col-span-11 md:col-span-5">
          <table className="w-full">
            <tbody>
              <tr className="border--t">
                <td className="w-32 whitespace-nowrap pr-2 py-2">
                Tanggal:
                </td>
                <td className="p-0 pb-2">
                  <input
                    type="date"
                    value={date1}
                    className="text-sm w-36 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                    onChange={e => setDate1(e.target.value)}
                  />
                </td>
              </tr>
              <tr className="border--t">
                <td className="whitespace-nowrap pr-2 py-2">Token batch:</td>
                <td className="p-0 pb-1">
                  <input
                    type="text"
                    value={token}
                    placeholder="5 - 15 karakter"
                    onChange={e => setToken(e.target.value)}
                    className="text-sm w-36 h-8 w-leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                  />
                </td>
              </tr>
              <tr className="border--t">
                <td className="whitespace-nowrap pr-2 py-2">Urutan tes:</td>
                <td className="p-0 pb--1 h-10">
                  <select
                    className="text-sm w-36 h-8 leading-tight pl-2 pr-10 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                    onChange={e => setOrder(e.target.value)}
                  >
                    <option value="1">Urut</option>
                    <option value="0">Bebas</option>
                  </select>
                </td>
              </tr>
              <tr className="border--t">
                <td className="whitespace-nowrap pr-2 py-2">Waku tes:</td>
                <td className="p-0 h-10">
                  <select type="text"
                    className="text-sm w-36 h-8 leading-tight pl-2 pr-8 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                    onChange={e => setTiming(e.target.value)}
                  >
                    <option value="slot">Sesuai jadwal</option>
                    <option value="date1">Sepanjang hari</option>
                    <option value="2">2 hari</option>
                    <option value="3">3 hari</option>
                  </select>
                  <span className="text-base ml-2">*</span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-xs italic py-2">
                  * {testTiming[timing]}{` `}
                  {date2 && <><span className="text-green-600 font-bold">{date2}</span>.</>}
                </td>
              </tr>
              <tr>
                <td className="pr-3">
                  <button
                    className={`w-full rounded text-xs font-bold text-red-500 px-5 h-8
            border hover:border-gray-400 focus:border-gray-400 focus:outline-none
            focus:ring-2 focus:ring-offset-0 focus:ring-yellow-100`}
                  >Cancel</button>
                </td>
                <td className="">
                  <button
                    className={`w-36 rounded text-xs font-bold text-white px-5 h-8
            bg-green-500 hover:bg-green-600 focus:border--blue-300 focus:outline-none
            focus:ring-1 focus:ring-offset-1 focus:ring-green-400`}
                    onClick={saveTestMode}
                  >Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="hidden md:block col-span-11 md:col-span-6 bg-yellow-50">
          <pre>
            TOKEN : {token}<br/>
            ORDER : {order}<br/>
            DATE1 : {date1}<br/>
            DATE2 : {date2}<br/>
            TIMING: {timing}<br/>
          </pre>
        </div>
      </div>

      {groups && groups.length > 0 && (
        <div className="">
          <div className="border--b pb-2 mt-7">
            <Subhead title="Saved schedule"></Subhead>
          </div>
          <div className="overflow-x-scroll">
            <Schedule groups={groups} />
          </div>

          <div className="border--b pb-2 mt-7">
            <Subhead title="Saved groups"></Subhead>
          </div>
          <PersistedGroups groups={groups} />
        </div>
      )}

      {!groups || groups.length == 0 && (
        <div className="">
          <div className="border--b pb-2 mt-7">
            <Subhead title="Tentative schedule"></Subhead>
          </div>
          <div className="overflow-x-scroll">
            <Schedule groups={schedules} tentative={true} />
          </div>

          <div className="border--b pb-2 mt-7">
            <Subhead title="Tentative groups"></Subhead>
          </div>
          <RuntimeGroups groups={schedules} />
        </div>
      )}

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
