import { useEffect, useState } from "react"

export default function ActiveBatch({ batch, modules }) {
  const [hasModules, setHasModules] = useState(false);
  const [tests, setTests] = useState([]);
  const [sims, setSims] = useState([]);

  function getPersons() {
    if (batch.personae == 0) return <span className="text-red-500">Belum ada daftar</span>;
    return <>
      <span className="font-bold">{batch.personae}</span>
      <span className="text-gray-500 ml-2">orang</span>
    </>;
  }

  function getSims() {
    if (!hasModules) return <span className="text-red-500">Modul belum terinstal</span>;
    else {
      if (tests.length == 0) return <span className="text-gray-500">Tidak ada</span>;
      return <>
        <span className="font-bold">{tests.length}</span>
        <span className="text-gray-500 ml-2">modul</span>
      </>;
    }
  }

  function getGuided() {
    if (!hasModules) return <span className="text-red-500">Modul belum terinstal</span>;
    else {
      if (sims.length == 0) return <span className="text-gray-500">Tidak ada</span>;
      else {
        const titles = [];
        sims.forEach(s => { titles.push(s.title) });
        return <span className="font-bold">{titles.join(", ")}</span>;
      }
    }
  }

  function Datarow({ children, title }) {
    return (
      <tr className="border-t">
        <td className="w-1/5 h-8 whitespace-nowrap py-2 pr-2">{title}:</td>
        <td className="h-8 px-2 py-2">{children}</td>
      </tr>
    )
  }

  if (!batch) return null;

  useEffect(() => {
    if (modules) {
      if (batch.modules.length > 0) setHasModules(true);

      const tests = [], guided = [];
      modules.forEach(m => {
        if (batch.modules.includes(m._id)) {
          if (m.method == 'selftest') tests.push(m);
          else guided.push(m);
        }
      })

      setTests(tests);
      setSims(guided);
    }
  }, [batch, modules])

  return (
    <div className="">
      <div className="">
        <table className="w-full border-b leading-relaxed">
          <tbody>
            <Datarow title="Nama batch">
              <span className="font-bold">{batch.title}</span>
            </Datarow>
            <Datarow title="Tanggal">
              <span className="font-bold">{batch.date1}</span>
            </Datarow>
            <Datarow title="Status">
              <span className="font--medium">&mdash;</span>
            </Datarow>
            <Datarow title="Jumlah peserta">
              <span className="font--medium">{getPersons()}</span>
            </Datarow>
            <Datarow title="Test mandiri">
              <span className="font--medium">{getSims()}</span>
            </Datarow>
            <Datarow title="Test terpandu">
              <span className="font--medium">{getGuided()}</span>
            </Datarow>
            <Datarow title="Token online">
              <span className="text-gray-400">not set</span>
            </Datarow>
            <Datarow title="Grouping & skedul">
              <span className="">6 grup</span>
              <span className="text-gray-400 ml-2">(tentative)</span>
              <span className="text-blue-500 font-normal ml-2">Lihat halaman Grouping & Schedules</span>
            </Datarow>
          </tbody>
        </table>
      </div>
    </div>
  )
}