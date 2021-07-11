import { useEffect, useState } from "react";
import useBatchPersonae from "hooks/useBatchPersonae";

export default function PersistedGroups({ groups }) {
  // const { groups, isLoading: gLoading, isError: gError } = useBatchGroups(bid);
  const bid = groups[0].bid;
  const { personae, isError: pError, isLoading: pLoading } = useBatchPersonae(bid, "fullname");

  const [names, setNames] = useState([]);
  const [selections, setSelections] = useState([]);

  useEffect(() => {
    if (personae && personae.length > 0) {
      const array = {};
      personae.forEach(p => {
        array[p._id] = p.fullname;
      });

      setNames(array);
    }

    return () => {};
  }, [personae])

  if (pError) return <p>ERROR</p>;
  if (pLoading) return null;

  function test() {
    console.log(selections)
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {groups.map(group => (
          <div key={group.name} className="border border-blue-300 px-3 py-2">
            <div className="font-bold mb-2">{group.name}</div>
            <div className="text-xs py-1 mb-2 border-t border-b">
              {group.slot1 == "selftest" && <div>
                <table>
                  <tbody>
                    <tr>
                      <td>08.00 - 12.00</td><td className="px-3">Online test</td>
                    </tr>
                    <tr>
                      <td>13.00 - 14.30</td><td className="px-3">{group.slot3}</td>
                    </tr>
                    <tr>
                      <td>15.00 - 16.30</td><td className="px-3">{group.slot4}</td>
                    </tr>
                  </tbody>
                </table>
              </div>}
              {group.slot1 != "selftest" && <div>
                <table>
                  <tbody>
                    <tr>
                      <td>08.00 - 09.30</td><td className="px-3">{group.slot1}</td>
                    </tr>
                    <tr>
                      <td>10.00 - 11.30</td><td className="px-3">{group.slot2}</td>
                    </tr>
                    <tr>
                      <td>13.00 - 17.00</td><td className="px-3">Online test</td>
                    </tr>
                  </tbody>
                </table>
              </div>}
            </div>
            {group.persons.map(id => <button
              key={id}
              className={`${names[id] ? '' : 'text-red-500'}
              w-full bg-gray-50 text-left text-xs truncate px-2 py-1 mb-1`}
              onClick={e => {
                if (selections.length == 0) {
                  setSelections([{
                    group: group._id,
                    person: id,
                  }])
                } else if (selections.length == 1) {
                  setSelections(p => ([...p, {
                    group: group._id,
                    person: id,
                  }]))
                }

                test();
              }}
            >{names[id] || `- DELETED`}</button>)}
          </div>
        ))}
      </div>
    </div>
  );
}