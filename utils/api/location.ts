import { Location } from "../../types";
import { get } from "./index";

export function getLocations(): Promise<Location[]> {
  return get<Location[]>({ path: "/location" });
}
