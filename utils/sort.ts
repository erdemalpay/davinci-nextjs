import { Table } from "../types";

export function sortTable(a: Table, b: Table) {
  if (a.finishHour && !b.finishHour) {
    return 1;
  } else if (!a.finishHour && b.finishHour) {
    return -1;
  } else if (a.startHour > b.startHour) {
    return 1;
  } else if (a.startHour < b.startHour) {
    return -1;
  } else {
    return 0;
  }
}
