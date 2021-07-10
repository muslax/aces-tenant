import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useProjectPersonae(pid) {
  const { data, error, mutate } = useSWR(`${APIROUTES.GET.PERSONAE}&pid=${pid}`, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}