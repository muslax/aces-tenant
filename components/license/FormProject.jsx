import useClients from "hooks/useClients";
import fetchJson from "lib/fetchJson";
import { useEffect, useState } from "react";

import { APIROUTES } from "config/routes";
import { generatePOSTData } from "lib/utils";

import PostModal from "components/PostModal";

export default function FormProject({ onCancel, mutate, callbak }) {
  const { clients, isError, isLoading } = useClients();

  const [options, setOptions] = useState([{
    _id: '',
    name: '- New Client',
    address: '',
    city: ''
  }])
  const [selected, setSelected] = useState(options[0]);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [fullTitle, setFullTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contractDate, setContractDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  //
  const [cid, setClientId] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  useEffect(() => {
    if (!clients) return;

    let array = [{
      _id: '',
      name: '- New Client',
      address: '',
      city: ''
    }];
    clients.forEach(c => array.push({
      _id: c._id,
      name: c.name,
      address: c.address,
      city: c.city,
    }));
    setOptions(array);
    setSelected(array[0]);

    return () => {}
  }, [clients])

  useEffect(() => {
    setClientId(selected._id);
    setClientName(selected._id ? selected.name : '');
    setClientCity(selected.city);
    setClientAddress(selected.address);

    if (selected._id) {
      document.querySelectorAll('.input-client').forEach(el => el.classList.remove('error'));
    }

    return () => {}
  }, [selected])

  if (isLoading) return null;

  function isReady() {
    const err = document.querySelectorAll('.error');
    return err.length == 0
      && clientName.length > 0
      && clientAddress.length > 0
      && clientCity.length > 0
      && title.length > 0;
  }

  async function handleSubmit(e) {
    if (!isReady()) alert('Form belum lengkap.');

    setSubmitting(true);
    const url = cid
      ? APIROUTES.POST.SAVE_CLIENT_PROJECT
      : APIROUTES.POST.SAVE_PROJECT;

    await fetchJson(url, generatePOSTData({
      // lid: user.lid,
      status: null,
      batchMode: 'multiple',
      title: title,
      fullTitle: title, // fullTitle,
      description: description,
      contractDate: contractDate,
      contacts: [],
      cid: cid,
      clientName: clientName,
      clientCity: clientCity,
      clientAddress: clientAddress,
    }))

    mutate();
    setSubmitting(false);
    callbak();
  }

  return <>
    <div className="form-box">
      <table className="w-full">
        <tbody>
          <tr className="">
            <td colSpan="2" className="px-5 pt-4 pb-3">
              Semua kolom harus diisi.
            </td>
          </tr>
          <tr className="">
            <td colSpan="2" className="px-5">
              <div className={(submitting ? 'progress ' : '') + 'bg-gray-200s border-t border-gray-400 h-1 mb-3'}></div>
            </td>
          </tr>

          <tr>
            <td width="25%" className="whitespace-nowrap px-5 pt-1 pb-2">Judul Proyek:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                value={title}
                className={`input-license w-full font-bold}`}
                placeholder="Min. 10 karakter"
                onChange={e => {
                  setTitle(e.target.value);
                  // if (fullTitle.length == 0) setFullTitle(e.target.value);
                }}
                onBlur={e => {
                  const v = e.target.value.trim();
                  setTitle(v);
                  // if (fullTitle.length == 0) setFullTitle(v.trim());
                  if (v.length < 10) e.target.classList.add('error');
                  else e.target.classList.remove('error');
                }}
              />
            </td>
          </tr>
          {/* <tr>
            <td width="25%" className="whitespace-nowrap px-5 pt-1 pb-2">Judul Lengkap:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                value={fullTitle}
                className={`input-license w-full font-bold}`}
                onChange={e => setFullTitle(e.target.value)}
                onBlur={e => {
                  const v = e.target.value;
                  if (v.length < 10) e.target.classList.add('error');
                  else e.target.classList.remove('error');
                }}
              />
            </td>
          </tr> */}
          <tr>
            <td className="whitespace-nowrap px-5 pt-1 pb-2">Deskripsi Proyek:</td>
            <td className="pr-5 pt-1 pb-2">
              <textarea
                value={description}
                className="input-license w-full"
                onChange={e => setDescription(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="whitespace-nowrap px-5 pt-0 pb-2">Tanggal Kontrak:</td>
            <td className="pr-5 pt-0 pb-2">
              <input
                type="date"
                value={contractDate}
                className="input-license w-32"
                onChange={e => setContractDate(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                }}
              />
              {/* <span className="mx-3">s/d</span>
              <input
                type="date"
                value={endDate}
                className="input-license w-32"
                onChange={e => setEndDate(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                  // if (v.length == 0) setNameError("Kolom nama harus diisi.")
                  // else setNameError(null)
                }}
              /> */}
            </td>
          </tr>

          <tr><td colSpan="2" className="h-1"></td></tr>

          <tr className="bg-gray-100">
            <td className="px-5 py-3">
              <div className="text-center">Pilih klien</div>
            </td>
            <td className="py-3 pr-5">
              <div className="">
                <select
                  className="input-license"
                  onChange={e => {
                    setSelected(options.filter(c => c._id == e.target.value)[0])
                  }}
                >
                  {options.map(c => (
                    <option key={c.name} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </td>
          </tr>

          <tr><td colSpan="2" className="h-1"></td></tr>

          <tr>
            <td className="whitespace-nowrap px-5 pt-3 pb-2">Perusahaan:</td>
            <td className="pr-5 pt-3 pb-2">
              <input
                type="text"
                disabled={selected._id != ''}
                value={clientName}
                className="input-client input-license w-full"
                onChange={e => setClientName(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                  if (v.length == 0) e.target.classList.add('error');
                  else e.target.classList.remove('error');
                }}
              />
            </td>
          </tr>

          <tr>
            <td className="whitespace-nowrap px-5 pt-1 pb-2">Alamat:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                disabled={selected._id != ''}
                value={clientAddress}
                className="input-client input-license w-full"
                onChange={e => setClientAddress(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                  if (v.length == 0) e.target.classList.add('error');
                  else e.target.classList.remove('error');
                }}
              />
            </td>
          </tr>

          <tr>
            <td className="whitespace-nowrap px-5 pt-1 pb-2">Kota:</td>
            <td className="pr-5 pt-1 pb-2">
              <input
                type="text"
                disabled={selected._id != ''}
                value={clientCity}
                className="input-client input-license w-full"
                onChange={e => setClientCity(e.target.value)}
                onBlur={e => {
                  const v = e.target.value.trim();
                  if (v.length == 0) e.target.classList.add('error');
                  else e.target.classList.remove('error');
                }}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td className="py-3 pr-4">
              <div className="flex space-x-3">
                <button className="rounded-sm bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-200 font-semibold h-8 px-5"
                  onClick={handleSubmit}
                >
                  Save User
                </button>
                <button
                  className="rounded-sm border border-gray-300 hover:border-gray-400 text-gray-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-200 font-semibold h-8 px-5"
                  onClick={onCancel}
                >Cancel</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    {/* <pre>{startDate} {JSON.stringify(errors, null, 2)}</pre> */}
    {/* <pre>OPT {JSON.stringify(options, null, 2)}</pre> */}
    {/* <FixedOverlay>
      <div className="rounded-sm shadow-lg">
        <div className="border border-white rounded-sm shadow">
          <div className="bg-white rounded-t-sm pl-4 pr-8 py-2">Saving new project...</div>
          <div className="progress h-2 bg-gray-300 rounded-b-sm"></div>
        </div>
      </div>
    </FixedOverlay> */}
    {submitting && <PostModal message="Saving project..." />}
  </>;
}