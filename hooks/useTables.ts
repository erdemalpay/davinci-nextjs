import { useState, useEffect } from "react";
import { Table } from "../types";

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);

  /* useEffect(async () => {
		await 
	}) */

  return {
    tables,
  };
}
