import { Paths, useGetItems, useMutationApi } from "./factory";
import { MenuItem } from "../../types/index";

export function useMenuItemMutations(initialItems: MenuItem[] = []) {
  return useMutationApi<MenuItem>({
    baseQuery: Paths.MenuItems,
  });
}

export function useGetMenuItems() {
  return useGetItems<MenuItem>(Paths.MenuItems, false);
}
