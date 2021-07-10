import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatchPersonae(bid, fields) {
  // const { data, error, mutate } = useSWR(`${APIROUTES.GET.BATCH_PERSONAE}&bid=${bid}`, fetchJson)
  let uri = `${APIROUTES.GET.BATCH_PERSONAE}&bid=${bid}`;
  if (fields != undefined) uri = `${uri}&fields=${fields}`;
  const { data, error, mutate } = useSWR(uri, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}