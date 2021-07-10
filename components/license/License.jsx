import { FolderIcon } from '@heroicons/react/outline';
import { UserCircleIcon } from '@heroicons/react/solid';
import useLicense from 'hooks/useLicense';

import Link from 'next/link';

const License = ({ user }) => {
  const { license, isError, isLoading } = useLicense();

  if (isLoading) return null;

  return <>
    <div className="rounded-sm border hover:border-gray-300 hover:shadow-sm px-5 py-1">
      <table className="w-full text-sm text-gray-700">
        <tbody>
          <tr>
            <td width="25%" className="text-gray-500 whitespace-nowrap pr-4 py-3">
              License ID:
            </td>
            <td className="py-3">
              <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                {license._id}
              </div>
            </td>
          </tr>
          <tr className="border-t">
            <td className="text-gray-500 whitespace-nowrap pr-4 py-3">
              License Name:
            </td>
            <td className="font-semibold py-3">
              {license.title}
            </td>
          </tr>
          <tr className="border-t">
            <td className="text-gray-500 whitespace-nowrap pr-4 py-3">
              Contact Name:
            </td>
            <td className="font-semibold py-3">
              {license.contact.fullname}
            </td>
          </tr>
          <tr className="border-t">
            <td className="text-gray-500 whitespace-nowrap pr-4 py-3">
              Publish Date:
            </td>
            <td className="font-semibold py-3">
              {license.publishDate.substr(0, 10)}
            </td>
          </tr>
          <tr className="border-t">
            <td className="text-gray-500 whitespace-nowrap pr-4 py-3">
              Expiry Date:
            </td>
            <td className="font-semibold py-3">
              {license.expiryDate.substr(0, 10)}
            </td>
          </tr>
        </tbody>
      </table>
      <hr/>
      <br/><br/><br/><br/><br/><br/>
      {/* <pre>{JSON.stringify(license, null, 2)}</pre> */}
    </div>
  </>;
}

export default License;