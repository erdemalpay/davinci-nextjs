import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

export function useAuthedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TData, TError> {
  const query = useQuery(queryKey, queryFn, options);
  const router = useRouter();
  if (query?.error) {
    Cookies.remove("jwt");
    router.push("/login");
    window.location.reload();
  }
  return query;
}

export default useQuery;
