import useSWR from "swr";
import fetchJson from "lib/fetchJson";

export default function Prefetch({ uri }) {
  const { data, error } = useSWR(uri, fetchJson);

  if (!data && !error) return <></>;

  return <div className="hidden">{JSON.stringify(data,null,0)}</div>
}