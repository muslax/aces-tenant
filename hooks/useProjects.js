import { API } from "config/api"
import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useProjects() {
  const { data, error, mutate } = useSWR(APIROUTES.GET.PROJECTS, fetchJson)

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}