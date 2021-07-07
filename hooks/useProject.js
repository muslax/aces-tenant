import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useProject(pid) {
  const { data, error, mutate } = useSWR(`${APIROUTES.GET_PROJECT}&pid=${pid}`, fetchJson)

  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}