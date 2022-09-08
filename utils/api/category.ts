import { Paths, useGetItems, useMutationApi } from "./factory";
import { MenuCategory } from "../../types/index";

export function useCategoryMutations() {
  const {
    deleteItem: deleteCategory,
    updateItem: updateCategory,
    createItem: createCategory,
  } = useMutationApi<MenuCategory>({
    baseQuery: Paths.MenuCategories,
  });

  return { deleteCategory, updateCategory, createCategory };
}

export function useGetCategories() {
  return useGetItems<MenuCategory>(Paths.MenuCategories, false);
}
