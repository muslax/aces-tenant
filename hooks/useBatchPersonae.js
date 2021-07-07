import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatchPersonae(bid) {
  const { data, error, mutate } = useSWR(`${APIROUTES.GET.BATCH_PERSONAE}&bid=${bid}`, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}