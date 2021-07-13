export default function Schedule({ groups, tentative = false }) {
  if (!groups || groups.length == 0) return <p className="text-red-500">EMPTY</p>;

  const color = tentative ? 'pink' : 'blue';

  return (
    <div className="">
      <div className="hidden border border-pink-200"></div>
      <div className="hidden border border-blue-200"></div>
      <table className="w-full text-xs my--8">
        <tbody>
          <tr className={`border-t bg-gray-50 border-b border-${color}-300`}>
            <td className="font-medium p-2">Group</td>
            <td width="18%" className={`border-l border-${color}-200 font-medium p-2`}>08.00</td>
            <td width="18%" className={`border-l border-${color}-200 font-medium p-2`}>10.00</td>
            <td width="18%" className={`border-l border-${color}-200 font-medium p-2`}>13.00</td>
            <td width="18%" className={`border-l border-${color}-200 font-medium p-2`}>15.00</td>
          </tr>
        </tbody>
        {groups.map((g, i) => (
        <tbody key={g.name}>
          {g.slot1 == "selftest" && (
            <tr key={g.name} className={`border-b border-${color}-300`}>
              <td className="font-medium px-2 py-2">
                <span className="whitespace-nowrap">{g.name}</span>{` `}
                <span className="whitespace-nowrap text-gray-400">({g.persons.length} orang)</span>
              </td>
              <td colSpan="2" className={`border-l border-${color}-200 text-center px-2 py-1`}>Waktu pengerjaan tes online</td>
              <td className={`border-l border-${color}-200 px-2 py-1`}>{g.slot3}</td>
              <td className={`border-l border-${color}-200 px-2 py-1`}>{g.slot4}</td>
            </tr>
          )}
          {g.slot1 != "selftest" && (
            <tr key={g.name} className={`border-b border-${color}-300`}>
              <td className="font-medium px-2 py-2">
                <span className="whitespace-nowrap">{g.name}</span>{` `}
                <span className="whitespace-nowrap text-gray-400">({g.persons.length} orang)</span>
              </td>
              <td className={`border-l border-${color}-200 px-2 py-1`}>{g.slot1}</td>
              <td className={`border-l border-${color}-200 px-2 py-1`}>{g.slot2}</td>
              <td colSpan="2" className={`border-l border-${color}-200 text-center px-2 py-1`}>Waktu pengerjaan tes online</td>
            </tr>
          )}
        </tbody>
          ))}
      </table>
    </div>
  )
}