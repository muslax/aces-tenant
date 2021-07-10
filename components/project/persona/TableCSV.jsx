export function TableCSV({ data }) {
  return (
    <table className="w-full text-xs whitespace-nowrap">
      <thead>
        <tr className="bg-gray-200 text-xs uppercase text-gray-600">
          <td className="h-7 px-2 py-1 text-right">##</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">fullname</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">username</td>
          <td className="col-email h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">email</td>
          <td className="col-gender h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">l/p</td>
          <td className="col-birth h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">birth</td>
          <td className="col-phone h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">phone</td>
          <td className="col-nip h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">nip</td>
          <td className="col-position h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">position</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">c-Level</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">t-Level</td>
        </tr>
        {data.length > 0 && <tr>
          <td colSpan="11" className="h-0 p-0 bg-gray-400 border-t border-gray-400"></td>
        </tr>}
      </thead>
      <tbody>
      {data.map(({
        fullname,
        username,
        email,
        gender,
        birth,
        phone,
        nip,
        position,
        currentLevel,
        targetLevel,
        xfpwd }, index) => (
          <tr key={email} className={`bg-white border-b`}>
            <td className="h-7 px-2 py-1 text-right">{index + 1}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{fullname}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{username}</td>
            <td className="col-email h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{email}</td>
            <td className="col-gender h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{gender}</td>
            <td className="col-birth h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{birth}</td>
            <td className="col-phone h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{phone}</td>
            <td className="col-nip h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{nip}</td>
            <td className="col-position h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{position}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{currentLevel}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{targetLevel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}