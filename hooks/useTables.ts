import { useState, useEffect } from "react";
import { Table } from "../types";

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);

  return {
    tables,
  };
}
