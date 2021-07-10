export default function RuntimeGroups({ groups }) {
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {groups.map(group => (
          <div key={group.name} className="border border-pink-300 px-3 py-2">
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
            {group.persons.map(person => <p key={person._id} className="text-xs mb-1">{person.fullname}</p>)}
          </div>
        ))}
      </div>
    </div>
  )
}