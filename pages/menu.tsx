import { GetServerSideProps } from "next";
import { MenuCategory, MenuItem } from "../types";
import { FormEvent, useState } from "react";
import { Header } from "../components/header/Header";
import { TrashIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { EditableText } from "../components/common/EditableText";
import { generateServerSideApi } from "../utils/api/factory";
import { AddMenuCategoryDialog } from "../components/menu/AddCategoryDialog";
import { useCategories } from "../utils/api/category";
import { useMenuItems } from "../utils/api/menu-item";
import { AddMenuItemDialog } from "../components/menu/AddItemDialog";
import { CheckSwitch } from "../components/common/CheckSwitch";
import { EditModeText } from "../components/common/EditModeText";
import { get } from "lodash";
import { PlusIcon } from "@heroicons/react/solid";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { getItems: getCategories } =
    generateServerSideApi<MenuCategory>("/menu/categories");
  const initialCategories = await getCategories(context);

  const { getItems } = generateServerSideApi<MenuCategory>("/menu/items");
  const initialItems = await getItems(context);
  return { props: { initialCategories, initialItems } };
};

export default function MenuCategories({
  initialCategories,
  initialItems,
}: {
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
}) {
  const { categories, deleteCategory, updateCategory, createCategory } =
    useCategories(initialCategories);

  const { items, deleteItem, updateItem, createItem } =
    useMenuItems(initialItems);

  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>();

  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false);
  function updateCategoryHandler(
    event: FormEvent<HTMLInputElement>,
    item?: MenuCategory
  ) {
    if (!item) return;
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    updateCategory({
      id: item._id,
      updates: { [target.name]: target.value },
    });
    toast.success(`Category ${item.name} updated`);
  }

  function updateHandler(event: FormEvent<HTMLInputElement>, item?: MenuItem) {
    if (!item) return;
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    console.log({ item, value: target.value });
    if (get(item, target.name) === +target.value) {
      return;
    }

    updateItem({
      id: item._id,
      updates: { [target.name]: target.value },
    });
    toast.success(`Item ${item.name} updated`);
  }

  function updateItemCategory(category: number, item: MenuItem) {
    if (!item) return;
    updateItem({
      id: item._id,
      updates: { category },
    });
    toast.success(`Item ${item.name} updated`);
  }

  function checkDeleteCategory(category: MenuCategory) {
    if (items.find((item) => item.category === category._id)) {
      toast.error(
        `Category "${category.name}" cannot be deleted, it has items assigned. Remove/reassign them first to delete this category.`,
        { autoClose: 5000 }
      );
    } else {
      deleteCategory(category._id);
    }
  }

  const categoryColumns = [
    {
      id: "name",
      header: "Name",
      cell: (row: MenuCategory) => (
        <EditableText
          name="name"
          text={row.name}
          onUpdate={updateCategoryHandler}
          item={row}
        />
      ),
    },
    {
      id: "delete",
      header: "Action",
      cell: (row: MenuCategory) => (
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setIsCreateItemDialogOpen(true);
            }}
          >
            <PlusIcon className="text-blue-500 w-6 h-6" />
          </button>
          <button onClick={() => checkDeleteCategory(row)}>
            <TrashIcon className="text-red-500 w-6 h-6" />
          </button>
        </div>
      ),
    },
  ];

  const itemColumns = [
    {
      id: "name",
      header: "Name",
      cell: (row: MenuItem) => (
        <EditableText
          name="name"
          text={row.name}
          onUpdate={updateHandler}
          item={row}
        />
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: (row: MenuItem) => (
        <select
          name="category"
          onChange={(event) =>
            updateItemCategory(event.target.value as unknown as number, row)
          }
          className="py-2 border-b-[1px] border-b-grey-300 focus:outline-none text-sm"
          value={(row.category as number) + ""}
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      ),
    },
    {
      id: "priceBahceli",
      header: "Price (Bahçeli)",
      cell: (row: MenuItem) => (
        <EditModeText
          name="priceBahceli"
          type="number"
          text={row.priceBahceli + ""}
          onUpdate={updateHandler}
          item={row}
          editMode={editMode}
        />
      ),
    },
    {
      id: "priceNeorama",
      header: "Price (Neorama)",
      cell: (row: MenuItem) => (
        <EditModeText
          name="priceNeorama"
          type="number"
          text={row.priceNeorama + ""}
          onUpdate={updateHandler}
          item={row}
          editMode={editMode}
        />
      ),
    },
    {
      id: "delete",
      header: "Action",
      cell: (row: MenuItem) => (
        <button onClick={() => deleteItem(row._id)}>
          <TrashIcon className="text-red-500 w-6 h-6" />
        </button>
      ),
    },
  ];

  return (
    <>
      <Header showLocationSelector={false} />

      <div className="flex flex-col gap-4 mx-0 lg:mx-20">
        <div className="bg-white shadow w-full px-6 py-5 mt-4">
          <div className="mb-5 rounded-tl-lg rounded-tr-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base lg:text-2xl font-bold leading-normal text-gray-800">
                Menu Categories
              </p>
            </div>
          </div>
          <div className="h-full w-full">
            <div className="flex justify-end gap-x-4">
              <button
                onClick={() => setIsCreateCategoryDialogOpen(true)}
                className="my-3 bg-white rounded border border-gray-800 text-gray-800 px-6 py-2 text-sm"
              >
                Add
              </button>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="h-10 w-full text-sm leading-none text-gray-600">
                    {categoryColumns.map((column) => (
                      <th key={column.id} className="font-bold text-left">
                        <div className="flex gap-x-2">{column.header}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="w-full">
                  {categories?.map((category) => (
                    <tr
                      key={category._id}
                      className="h-10 text-sm leading-none text-gray-700 border-b border-t border-gray-200 bg-white hover:bg-gray-100"
                    >
                      {categoryColumns.map((column) => {
                        return (
                          <td key={column.id} className="">
                            {column.cell(category)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-white shadow w-full px-6 py-5 mt-4">
          <div className="mb-5 rounded-tl-lg rounded-tr-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base lg:text-2xl font-bold leading-normal text-gray-800">
                Menu Items
              </p>
            </div>
          </div>
          <div className="h-full w-full">
            <div className="flex justify-end gap-x-4 items-center">
              <h1 className="text-md">Edit Prices</h1>
              <CheckSwitch
                checked={editMode}
                onChange={() => setEditMode((value) => !value)}
                checkedBg="bg-red-500"
              ></CheckSwitch>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="h-10 w-full text-sm leading-none text-gray-600">
                    {itemColumns.map((column) => (
                      <th key={column.id} className="font-bold text-left">
                        <div className="flex gap-x-2">{column.header}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="w-full">
                  {items?.map((item) => (
                    <tr
                      key={item._id}
                      className="h-10 text-sm leading-none text-gray-700 border-b border-t border-gray-200 bg-white hover:bg-gray-100"
                    >
                      {itemColumns.map((column) => {
                        return (
                          <td key={column.id} className="">
                            {column.cell(item)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isCreateCategoryDialogOpen && (
        <AddMenuCategoryDialog
          isOpen={isCreateCategoryDialogOpen}
          close={() => setIsCreateCategoryDialogOpen(false)}
          createCategory={createCategory}
        />
      )}
      {isCreateItemDialogOpen && (
        <AddMenuItemDialog
          isOpen={isCreateItemDialogOpen}
          close={() => setIsCreateItemDialogOpen(false)}
          createItem={createItem}
          category={selectedCategory}
        />
      )}
    </>
  );
}
