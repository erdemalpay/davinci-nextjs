import { useGenerateApi } from "./factory";
import { MenuCategory } from "../../types/index";

export function useCategories(initialItems: MenuCategory[] = []) {
  const {
    items: categories,
    deleteItem: deleteCategory,
    updateItem: updateCategory,
    createItem: createCategory,
  } = useGenerateApi<MenuCategory>({
    baseQuery: "/menu/categories",
    initialItems,
  });

  return { categories, deleteCategory, updateCategory, createCategory };
}
