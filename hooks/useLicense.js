import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useLicense() {
  const { data, error, mutate } = useSWR(APIROUTES.GET_LICENSE, fetchJson)

  return {
    license: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}