import { useEffect, useState } from "react"

export default function ActiveBatch({ batch, modules }) {
  const [hasModules, setHasModules] = useState(false);
  const [tests, setTests] = useState([]);
  const [sims, setSims] = useState([]);

  function getPersons() {
    if (batch.personae == 0) return <span className="text-red-500">Data belum tersedia</span>;
    return <>
      <span className="font-bold">{batch.personae}</span>
      <span className="text-gray-500 ml-2">orang</span>
    </>;
  }

  function getModules() {
    if (!hasModules) return <span className="text-red-500">Modul belum terinstal</span>;
    const mtests = <>
      <span className="">{tests.length}</span>
      <span className="ml-2">tes mandiri </span>
    </>;
    const mguided = <>
      <span className="">{sims.length}</span>
      <span className="ml-2">temu muka</span>
    </>;

    if (tests.length > 0 && sims.length == 0) return mtests;
    else if (sims.length > 0 && tests.length == 0) return mguided;
    return <div className="text-gray--400 font-bold">
      {mtests} <span className="text-gray-400 font-normal mx-2">&ndash;</span> {mguided}
    </div>;
  }

  function getGroups() {
    if (batch.groups == 0) return <span className="text-red-500">Belum terkonfirmasi</span>;
    return <>
      <span className="font-bold">{batch.groups}</span>
      <span className="text-gray-500 ml-2">grup</span>
    </>;
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
              <span className="text-gray-300 font-bold mx-2">/</span>
              <span className="font-bold">{batch.date1}</span>
            </Datarow>
            <Datarow title="Status">
              <span className="font--medium">&mdash;</span>
            </Datarow>
            <Datarow title="Modul&nbsp;ACES">
              <span className="font--medium">{getModules()}</span>
            </Datarow>
            <Datarow title="Jumlah peserta">
              <span className="font--medium">{getPersons()}</span>
            </Datarow>
            {/* <Datarow title="Test mandiri">
              <span className="font--medium">{getSims()}</span>
            </Datarow>
            <Datarow title="Test terpandu">
              <span className="font--medium">{getGuided()}</span>
            </Datarow>
            <Datarow title="Token online">
              <span className="text-gray-400">not set</span>
            </Datarow> */}
            <Datarow title="Grouping & skedul">
              {getGroups()}
            </Datarow>
          </tbody>
        </table>
      </div>
    </div>
  )
}