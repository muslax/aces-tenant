import { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronDownIcon, OfficeBuildingIcon } from '@heroicons/react/outline';
import { FolderIcon, IdentificationIcon } from '@heroicons/react/solid';

import useClients from 'hooks/useClients';
import { CardBox } from './Boxes';

const Clients = ({ user }) => {
  const { clients, isError, isLoading } = useClients();
  const [vStack, setVStack] = useState([]);

  if (isLoading) return null;

  const icon = <IdentificationIcon className="h-6 w-6 text-gray-300"/>;

  return <>
    <div className="flex flex-col space-y-4">
      {clients.map(client => (
        <CardBox key={client._id} icon={icon}>
          <div className="flex">
            <div className="flex-grow text-base text-gray-600s font-bold mb-1">{client.name}</div>
            <div className="text-xs text-gray-400">
              {!vStack.includes(client._id) && (
                <button className="flex space-x-px hover:text-gray-600"
                  onClick={e => setVStack(prev => ([...vStack, client._id]))}
                >
                  <span>Projects</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}
              {vStack.includes(client._id) && (
                <button className="flex space-x-px hover:text-gray-600"
                  onClick={e => setVStack(vStack.filter(item => item != client._id))}
                >
                  <span>Projects</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="text-gray-500">
            <p className="">{client.address}</p>
            <p className="">{client.city}</p>
            <p className="">Telepon: {client.phone}</p>
            {/* <hr className="my-2"/> */}
            {vStack.includes(client._id) && (
              <div className="mt-3">
                {client.projects.map(prj => (
                  <div key={prj._id} className="flex items-center space-x-2 border-t border-gray-100 py-2">
                    <FolderIcon className="w-4 h-4 text-gray-400" />
                    <div className="flex-grow">
                      <Link href={`/projects/${prj._id}`}>
                        <a className="text-blue-500">
                          {prj.title}
                        </a>
                      </Link>
                    </div>
                    <div className="text-xs">{prj.contractDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBox>
      ))}
    </div>
    {/* <pre>{JSON.stringify(clients, null, 2)}</pre> */}
  </>;
}

export default Clients;
