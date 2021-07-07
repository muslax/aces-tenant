import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatches(pid) {
  const { data, error, mutate } = useSWR(`${APIROUTES.GET.BATCHES}&pid=${pid}`, fetchJson)

  return {
    batches: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}