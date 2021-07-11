import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useClients() {
  const { data, error, mutate } = useSWR(APIROUTES.GET.CLIENTS, fetchJson)

  return {
    clients: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}