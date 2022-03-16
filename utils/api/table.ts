import { get, post } from "./index";
import { Table } from "../../types/index";
import { PossibleContext } from "../serverUtils";

interface TableRequest extends PossibleContext {
  location: number;
}

interface TableCreateRequest extends PossibleContext {
  payload: Table;
}

export function getTables({
  location,
  context,
}: TableRequest): Promise<Table[]> {
  return get<Table[]>({ path: `/tables/all?location=${location}`, context });
}

export function createTable({ payload }: TableCreateRequest): Promise<Table> {
  return post<Table, Table>({
    path: `/tables/`,
    payload,
  });
}
