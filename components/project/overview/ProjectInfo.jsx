import { useEffect, useState } from "react";
// import { ChevronDoubleRightIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import useUsers from "hooks/useUsers";
import { API } from "config/api";
import fetchJson from "lib/fetchJson";
import { APIROUTES } from "config/routes";
import { generatePOSTData } from "lib/utils";
import Subheading from "./Subheading";

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
    <div className="mb-10">
      <Subheading title="Project Info">
        {!editing && canEdit && (
          <button
            className="px-1 text-blue-500"
            onClick={e => {
              setAdmin(project.admin.username);
              setEditing(true);
            }}
          >Edit Info</button>
        )}
      </Subheading>

      <table className="w-full border--b leading-relaxed">
        {editing && (
          <tbody>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">ID proyek:</td>
              <td className="h-10 p-2 text-gray-400">{project._id}</td>
            </tr>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">Judul:</td>
              <td className="h-10 py--1 ">
                <input
                  type="text"
                  value={title}
                  disabled={!canEdit}
                  onChange={e => setTitle(e.target.value)}
                  className="text-sm w-full h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                />
              </td>
            </tr>
            <tr className="align-top border-t">
              <td className="h-10 py-2 w-1/5">Deskripsi:</td>
              <td className="pt-1 pb-0">
                <textarea
                  value={description}
                  rows={3}
                  onChange={e => setDescription(e.target.value)}
                  className="text-sm block w-full leading-tight- px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                ></textarea>
                <div className="h-1"></div>
              </td>
            </tr>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">Tanggal&nbsp;kontrak:</td>
              <td className="h-10">
                <input type="date"
                  value={contractDate}
                  value={contractDate}
                  onChange={e => setContractDate(e.target.value)}
                  className="text-sm w-full w--36 h-8 leading-tight px-2 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                />
              </td>
            </tr>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">Admin:</td>
              <td className="h-10">
                <select
                  value={admin}
                  disabled={!user.licenseOwner}
                  onChange={e => setAdmin(e.target.value)}
                  className="text-sm w-full h-8 leading-tight px-2 pr-9 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                >
                  {users.map(u => <option key={u.username} value={u.username}>{u.fullname}</option>)}
                </select>
              </td>
            </tr>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">&nbsp;</td>
              <td className="py-3">
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
        )}
      </table>

      {!editing && (
        <table className="w-full border-b leading-relaxed">
          <tbody>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">ID proyek:</td>
              <td className="h-10 p-2 text-gray-400">{project._id}</td>
            </tr>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">Judul:</td>
              <td className="font-bold h-10 p-2">{project.title}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 w-1/5">Deskripsi:</td>
              <td className="font--medium p-2">{project.description}</td>
            </tr>
            <tr className="border-t">
              <td className="h-10 py-2 w-1/5">Tanggal&nbsp;kontrak:</td>
              <td className="font--semibold h-10 p-2">{project.contractDate}</td>
            </tr>
            <tr className="border-t">
              <td className="h-12 py-2 w-1/5">Admin:</td>
              {!user.licenseOwner && <td className="font-semibold h-12 p-2">{project.admin.fullname}</td>}
              {user.licenseOwner && (
                <td className="h-10">
                  <select
                    value={admin}
                    disabled={!user.licenseOwner}
                    onChange={e => setAdmin(e.target.value)}
                    className="text-sm w--full h-8 leading-tight px-2 pr-9 py-1 rounded bg-gray-100 border-gray-100 focus:bg-white focus:border-blue-300 focus:ring-blue-100"
                  >
                    {users.map(u => <option key={u.username} value={u.username}>{u.fullname}</option>)}
                  </select>
                  {admin != project.admin.username && <button
                    className="rounded ml-3 h-8 px-5 font-semibold bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
                    onClick={changeAdmin}
                  >Save</button>}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      )}


    </div>
  );
}