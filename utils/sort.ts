import { Table } from "../types";

export function sortTable(a: Table, b: Table) {
  if (a.finishHour && !b.finishHour) {
    return 1;
  } else if (!a.finishHour && b.finishHour) {
    return -1;
  } else if (isNaN(+a.name)) {
    return 1;
  } else if (isNaN(+b.name)) {
    return -1;
  } else if (+a.name > +b.name) {
    return 1;
  } else if (+a.name < +b.name) {
    return -1;
  } else {
    return 0;
  }
}
