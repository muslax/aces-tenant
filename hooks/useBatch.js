import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatch(bid) {
  const { data, error, mutate } = useSWR(`${APIROUTES.GET.BATCH}&bid=${bid}`, fetchJson)

  return {
    batch: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}