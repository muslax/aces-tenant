import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatchGroups(bid) {
  const { data, error, mutate } = useSWR(`${APIROUTES.GET.BATCH_GROUPS}&bid=${bid}`, fetchJson)

  return {
    groups: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}