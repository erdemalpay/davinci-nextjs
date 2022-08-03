import { useQuery } from "react-query";
import { Location } from "../../types";
import { get } from "./index";

const locationsPath = "/location";

export function getLocations(): Promise<Location[]> {
  return get<Location[]>({ path: locationsPath });
}

export function useGetLocations() {
  const { isLoading, error, data, isFetching } = useQuery(locationsPath, () =>
    getLocations()
  );
  return {
    isLoading,
    error,
    locations: data,
    isFetching,
  };
}
