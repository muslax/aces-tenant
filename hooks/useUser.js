import { APIROUTES } from "config/routes";
import useSWR from "swr";

export default function useUser() {
  const { data: user, error, mutate: mutateUser } = useSWR(APIROUTES.USER);

  const isLoading = !user && !error;

  return { user, mutateUser, isLoading };
}