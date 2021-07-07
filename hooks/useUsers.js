import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useUsers() {
  const { data, error, mutate } = useSWR(APIROUTES.GET_USERS, fetchJson)

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}