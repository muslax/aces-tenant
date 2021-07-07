import { useEffect, useState } from "react";
// import { ChevronDoubleRightIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import useUsers from "hooks/useUsers";
import { API } from "config/api";
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";
import { generatePOSTData } from "lib/utils";

export default function ProjectInfo({ user, project, mutate }) {
  const { users, isError, isLoading } = useUsers();

  const canEdit = user.username == project.admin.username;

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [contractDate, setContractDate] = useState(project.contractDate);
  const [admin, setAdmin] = useState(project.admin.username);

  useEffect(() => {
    setAdmin(project.admin.username);

    return () => {};
  }, [project])

  if (isLoading) return null;

  async function changeAdmin(e) {
    e.preventDefault();

    await fetchJson(APIROUTES.POST.CHANGE_PROJECT_ADMIN, generatePOSTData({
      id: project._id,
      admin: admin,
    }))

    mutate();
  }

  async function updateProject(e) {
    e.preventDefault();
    // setEditing(false);

    await fetchJson(APIROUTES.POST.UPDATE_PROJECT, generatePOSTData({
      id: project._id,
      title: title,
      description: description,
      contractDate: contractDate,
      admin: admin,
    }))

    mutate();
    setEditing(false);
  }

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-2">
        <h3 className="flex-grow text-base font-bold">Project Info</h3>
        {!editing && canEdit && (
          <button
            className="px-1 text-blue-500"
            onClick={e => {
              setAdmin(project.admin.username);
              setEditing(true);
            }}
          >Edit Info</button>
        )}
      </div>

      {!editing && (
        <table className="w-full leading-relaxed">
          <tbody>
            <tr className="align-top border-t">
              <td className="py-2 w-1/4">ID proyek:</td>
              <td className="py-2 ">{project._id}</td>
            </tr>
            <tr className="align-top border-t">
              <td className="py-2 w-1/4">Judul:</td>
              <td className="py-2 ">{project.title}</td>
            </tr>
            <tr className="align-top border-t">
              <td className="py-2 w-1/4">Deskripsi:</td>
              <td className="py-2 ">{project.description}</td>
            </tr>
            <tr className="align-top border-t">
              <td className="py-2 w-1/4">Tanggal&nbsp;kontrak:</td>
              <td className="py-2 ">{project.contractDate}</td>
            </tr>
            <tr className="align-middle border-t">
              <td className="py-2 w-1/4">Admin:</td>
              <td className="py-2 ">
                <div className="flex space-x-3">
                  <select
                    disabled={!user.licenseOwner}
                    value={admin}
                    className="input-project hover:border-gray-400 focus:ring-blue-100 focus:border-blue-300"
                    onChange={e => setAdmin(e.target.value)}
                  >
                    {users.map(u => <option key={u.username} value={u.username}>{u.fullname}</option>)}
                  </select>
                  {admin != project.admin.username && <button
                    className="rounded-sm borders px-5 font-semibold bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
                    onClick={changeAdmin}
                  >Save</button>}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {editing && (
        <div className="rounded border px-4 py-3">
        <table className="w-full leading-relaxed">
          <tbody>
            <tr className="align-middle border-t-">
              <td className="py-1 w-1/4">Judul:</td>
              <td className="py-1">
                <input
                  type="text"
                  value={title}
                  className="input-project w-full"
                  onChange={e => setTitle(e.target.value)}
                />
              </td>
            </tr>
            <tr className="align-middle border-t-">
              <td className="py-1 w-1/4">Deskripsi:</td>
              <td className="py-1 pb-px">
                <textarea
                  value={description}
                  className="input-project w-full"
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </td>
            </tr>
            <tr className="align-middle border-t-">
              <td className="py-1 w-1/4">Tanggal&nbsp;kontrak:</td>
              <td className="py-1 ">
                <input
                  type="date"
                  value={contractDate}
                  className="input-project w-40"
                  onChange={e => setContractDate(e.target.value)}
                />
              </td>
            </tr>
            <tr className="align-middle border-t-">
              <td className="py-1 w-1/4">Admin:</td>
              <td className="py-1 ">
                <select
                  disabled={!user.licenseOwner}
                  value={admin}
                  className="input-project"
                  onChange={e => setAdmin(e.target.value)}
                >
                  {users.map(u => <option key={u.username} value={u.username}>{u.fullname}</option>)}
                </select>
              </td>
            </tr>
            <tr className="align-middle border-t-">
              <td className=""></td>
              <td className="pt-3 pb-1">
                <div className="inline-flex space-x-3">
                  <button
                    className="rounded-sm bg-green-500 hover:bg-green-600 active:bg-green-700 px-5 h-8 text-white font-semibold"
                    onClick={updateProject}
                  >Save Changes</button>
                  <button
                    className="rounded-sm border hover:border-gray-300 active:border-gray-400 px-5 h-8 text-gray-500 font-semibold"
                    onClick={e => {
                      setAdmin(project.admin.username);
                      setEditing(false);
                    }}
                  >Cancel</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      )}





    </div>
  );
}