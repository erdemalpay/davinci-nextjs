import { get } from "./index";
import { Table } from "../../types/index";

export function getTables(): Promise<Table[]> {
  return get<Table[]>({ path: "/table" });
}
