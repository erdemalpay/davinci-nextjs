import { useGenerateApi } from "./factory";
import { MenuItem } from "../../types/index";

export function useMenuItems(initialItems: MenuItem[] = []) {
  return useGenerateApi<MenuItem>({
    baseQuery: "/menu/items",
    initialItems,
  });
}
