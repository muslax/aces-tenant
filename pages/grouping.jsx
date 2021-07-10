import { createGroups, createGroupsMeta, createSchedules } from 'lib/grouping';
import { useState, useEffect } from 'react';

const range = (start, end) => {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
}

const array = range(7, 111);

export default function Index() {
  const [number, setNumber] = useState(8);
  const [groups, setGroups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [meta, setMeta] = useState({});
  const [lastGroup, setLastGroup] = useState(null);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const opt = [];
    array.forEach(n => {
      opt.push(createGroupsMeta(n))
    })

    setOptions(opt);

    const persons = getSamplePersons(number);
    const _grouping = createGroupsMeta(persons.length);
    const _groups = createGroups(persons, _grouping);
    setGroups(_groups);
    setMeta(_grouping);
    setSchedules(createSchedules(_groups));
    setLastGroup(_groups[_groups.length - 1]);

  }, [number])

  return (
    <div className="max-w-4xl mx-auto p-6 mb-32">
      <h1 className="text-2xl">Grouping of {number} persons</h1>
      <div className="my-4">
        <input type="number" min="8" max="120" value={number} className="text-xls font-bold px-2 py-1"
          onChange={e => {
            let val = parseInt(e.target.value);
            if (isNaN(val)) val = 21;
            setNumber(val);
          }}
        />
      </div>

      <table className="text-sm bg-gray-200">
        <tbody>
          <tr className="borders border-gray-600">
            <td className="px-2 py-1">Jumlah Grup</td>
            <td className="text-white font-bold bg-gray-600 px-2 py-1">{meta?.grouping?.length}</td>
            <td className="bg-blue-200 border-l-4 border-white px-2 py-1">Tim Diskusi</td>
            <td className="text-white font-bold bg-blue-600 px-2 py-1">{meta?.div}</td>
            <td className="bg-red-200 border-l-4 border-white px-2 py-1">Tim Wawancara</td>
            <td className="text-white font-bold bg-red-600 px-2 py-1">{meta?.div}</td>
            <td className="bg-red-100 px-2 py-1">{meta?.team} orang</td>
          </tr>
        </tbody>
      </table>

      <div className="flex space-x-4 mt-6">
        <p className="text-xs text-gray-400">Last Group</p>
        <div className="flex-shrink-0 border border-gray-500 px-4 py-2">
          <p className="font-bold mb-3">
            {lastGroup ? lastGroup.groupName : '---'} &nbsp;&mdash;&nbsp; {lastGroup ? lastGroup.persons.length : '-'}
          </p>
          {lastGroup && lastGroup.persons.map(p => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <table className="w-full text-xs my-8">
        <tbody>
          <tr className="border-t border-b border-gray-300">
            <td className="font-medium p-2">Group</td>
            <td className="font-medium p-2">08.00</td>
            <td className="font-medium p-2">10.00</td>
            <td className="font-medium p-2">13.00</td>
            <td className="font-medium p-2">15.00</td>
          </tr>
          {schedules.map((g, i) => (
            <tr key={g.groupName} className="border-b border-gray-300">
              <td className="font-medium px-2 py-2">
                {g.groupName}
                <span className="text-gray-400 ml-2">({groups[i].persons.length} persons)</span>
              </td>
              <td className="px-2 py-1">{getAsesor(g, 'slot1')}</td>
              <td className="px-2 py-1">{getAsesor(g, 'slot2')}</td>
              <td className="px-2 py-1">{getAsesor(g, 'slot3')}</td>
              <td className="px-2 py-1">{getAsesor(g, 'slot4')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex space-x-4">
        <pre>GRP {groups.length} {JSON.stringify(groups[0], null, 2)}</pre>
        <pre>SCH {schedules.length} {JSON.stringify(schedules[0], null, 2)}</pre>
        <pre>META {JSON.stringify(meta, null, 2)}</pre>
      </div>

      <h3 className="font-bold mt-10 mb-3">Structure</h3>
      <div className="">
        <table className="text-xs font-mono">
          <tbody>
            <tr className="border-b border-t border-gray-400">
              <td className="px-2">Pop</td>
              <td className="px-2 border-l">Grup</td>
              <td className="px-2 border-l">Tim</td>
              <td className="px-2 border-l">ASW</td>
              <td className="px-2 border-l">Pola</td>
            </tr>
            {options.map(({ pop, div, team, grouping }) => (
              <tr key={'KEY' + pop} className="border-b">
                <td className="px-2">{pop}</td>
                <td className="px-2 border-l">{grouping.length}</td>
                <td className="px-2 border-l">{div}</td>
                <td className="px-2 border-l">{team}</td>
                <td className="px-2 border-l">{grouping.join(" ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <pre>
        {/* LAST GROUP: {groups.length} {JSON.stringify(groups[groups.length -1], null, 2)}<br/> */}
        {/* Schedules {schedules.length} {JSON.stringify(schedules[schedules.length -1], null, 2)}<br/> */}
        Grouping {JSON.stringify(meta, null, 2)}<br/>
      </pre>
    </div>
  );
}

const getSamplePersons = (n) => {
  if (!n || n === undefined || n < 8) n = 8;
  if (n > 120) n = 120;
  const array = fakePersons;
  // shuffleArray(array);
  return array.slice(0, n)
}

function getAsesor(group, slotName) {
  if (group[slotName] == 'diskusi') return <span className="text-indigo-500">Diskusi<br/>{group.asd}</span>;
  if (group[slotName] == 'wawancara') return <span className="text-red-600">Wawancara<br/>{group.asw}</span>;
  return <span className="text-green-600">Online</span>;
}

const fakePersons = [
  "Sambang Upadi Lulut",
  "Rama Bardiono",
  "Jonne Laksmi",
  "Danumaya Bawita",
  "Simon Tawang Yasan",
  "Sapar Sudira",
  "Bagas Damien Karni",
  "Renske Gemana Marek",
  "Bahuraksa Sadran",
  "Anggabaya Lorenzo",
  "Jaxson Thijs Amy",
  "Bardiman Samita",
  "Among Nari Ezra",
  "Teguh Kees Bernd",
  "Nolan Cepaka Purwaka",
  "Sudarpa Wawan",
  "Melissa Manah Wardaya",
  "Jameson Asiri Bianca",
  "Mujur Dave",
  "Panembrama Asirwada",
  "Amber Bahuwarna",
  "Wani Adikara Wasista",
  "Ian Mitra Ciptana",
  "Eman Adiharja Putri",
  "Jordan Asih",
  "Eluh Wibisono Arisanti",
  "Bataria Dariati Daliani",
  "Elok Jennifer",
  "Atmawati Waspa",
  "Gilang Giyarto",
  "Asirwanda Philip Huub",
  "Cagak Candrarupa",
  "Mari Bandriya Nienke",
  "Jess Wibowo",
  "Gede Candrika",
  "Maria Samapta Teja",
  "Warih Jariati",
  "Jasmijn Dwi",
  "Daliman Rangkung Purwa",
  "Dian Kenes Julie",
  "Atresia Ujud Maras",
  "Melvin Liam Suganda",
  "Ikawati Darsa Banawi",
  "Silke Bas Waskita",
  "Marta Luna",
  "Suzanne Emong Puspita",
  "Samuel Jonathan Wasis",
  "Gijs Merel",
  "Hartati Kasusra",
  "Aslijan Vera Suciatma",
  "Harjanti Estiningtyas Valerie",
  "Sunyata Joelle",
  "Evan Purnama",
  "Céline Bouke Sasangka",
  "James Hudson Darapuspita",
  "Endra Estiono Jessica",
  "Dalirin Sambada Bima",
  "Bratajaya Aiden",
  "Turmukti Maryadi",
  "Teges Wijaya Gayuh",
  "Salipah Gandewa Sudibya",
  "Tuladha Luwes Brian",
  "Santiago Maryanti Warangka",
  "Bambang Bestari",
  "Floor Tessa Utami",
  "Jagaraga Iswara",
  "Kedasih Lukita",
  "Danielle Ethan",
  "Jouri Titi Widayat",
  "Reja Reksa Asmuni",
  "Corné Werdaya",
  "Jan Tiyasa Kirsten",
  "Drajat Wadi Kasmirah",
  "Tirta Yuda",
  "Sudarga Batara Waluyo",
  "Margana Asipattra Martine",
  "Banu Alex Mirah",
  "Isabel Rupaka",
  "Dianti Stan Cakra",
  "Langgeng Elise Jaya",
  "Tresna Bagus",
  "Mahesa Unggul Jaeman",
  "Tarasari Candrawimba",
  "Branta Candra",
  "Fleur Roel",
  "Monica Djonno Cawisono",
  "Rahayu Kenari",
  "Untap Demi Jori",
  "Jamie Luwar",
  "Kusuma Yuwa Sebastian",
  "Atmariani Atmajaya",
  "Saban Bancar Hannah",
  "Sasmaka Bakidin",
  "Jaxon Bratadikara",
  "Jarno Aswani Respati",
  "Jindra Leo Karta",
  "Daniswara Aris Wastiqah",
  "Robin Yudayana",
  "Purwadi Hartana",
  "Gamani Sudarsana",
  "Floris Balijan Bryson",
  "Manah Asher",
  "Gara Candrakanti",
  "Jumadi Rick",
  "Titis Adiwidya",
  "Sadarpa Dartono Suciatma",
  "Yayi Sudarma",
  "Sasangka Balamantri Eline",
  "Darimin Romy",
  "Misha Bhaskoro Bondan",
  "Anggabaya Lanang Eluh",
  "Sambang Wijaya",
  "Isa Pramusita Yudayana",
  "Oliver Asirwada",
  "Colton Levi",
  "Elias Aditya",
  "Balapati Tom",
  "Asmiani Valerie Respati",
  "Marlon Tess",
  "Ralph Harimurti Caraka",
  "Wasista Harjanti",
  "Daliman Fynn Aristawati",
  "Bandriya Jayeng Sudarpa",
  "Estiningtyas Wasita Max",
  "Maverick Jayadi Merel",
  "Ranggah Sudana Wijaksana",
  "Heru Ade Jariani",
  "Elon Charlotte Jenske",
  "Eman Lulut Candrawimba",
  "Wirya Aiden",
  "Ajeng Wastiqah",
  "Candrika Guritno",
  "Ethan Mariadi Hannah",
  "Mujur Manon",
  "Darsirah Tirta",
  "Jennifer Ikawati",
  "Aswani Tanaya",
  "Bhagaskara Wulan",
  "Jindra Nindya",
  "Admaja Dianti Panembrama",
  "Purwastuti Lotte",
  "Tani Jeremiah",
];