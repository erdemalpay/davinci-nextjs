import { Location } from "../../types";
import { Paths, useGetItems } from "./factory";

export function useGetLocations() {
  return useGetItems<Location>(Paths.Location, false);
}
