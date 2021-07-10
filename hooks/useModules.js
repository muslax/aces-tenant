import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useModules() {
  const { data, error, mutate } = useSWR(APIROUTES.GET.MODULES, fetchJson)

  return {
    modules: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}