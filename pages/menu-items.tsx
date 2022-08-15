import { GetServerSideProps } from "next";
import { MenuCategory, MenuItem } from "../types";
import { FormEvent, useState } from "react";
import { Header } from "../components/header/Header";
import { TrashIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { EditableText } from "../components/common/EditableText";
import { generateServerSideApi } from "../utils/api/factory";
import { useMenuItems } from "../utils/api/menu-item";
import { Autocomplete } from "../components/common/Autocomplete";
import { useCategories } from "../utils/api/category";
import { AddMenuItemDialog } from "../components/menu/AddItemDialog";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { getItems } = generateServerSideApi<MenuCategory>("/menu/items");
  const initialItems = await getItems(context);
  return { props: { initialItems } };
};

export default function MenuItems({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const { items, deleteItem, updateItem, createItem } =
    useMenuItems(initialItems);
  const { categories } = useCategories();

  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);
  function updateHandler(event: FormEvent<HTMLInputElement>, item?: MenuItem) {
    if (!item) return;
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    updateItem({
      id: item._id,
      updates: { [target.name]: target.value },
    });
    toast.success(`Item ${item.name} updated`);
  }

  function updateCategory(category: number, item: MenuItem) {
    if (!item) return;
    updateItem({
      id: item._id,
      updates: { category },
    });
    toast.success(`Item ${item.name} updated`);
  }

  const columns = [
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
            updateCategory(event.target.value as unknown as number, row)
          }
          className="py-2 border-b-[1px] border-b-grey-300 focus:outline-none text-sm"
          value={(row.category as MenuCategory)._id + ""}
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
      header: "Bahçeli",
      cell: (row: MenuItem) => (
        <EditableText
          name="priceBahceli"
          type="number"
          text={row.priceBahceli + ""}
          onUpdate={updateHandler}
          item={row}
        />
      ),
    },
    {
      id: "priceNeorama",
      header: "Neorama",
      cell: (row: MenuItem) => (
        <EditableText
          name="priceNeorama"
          type="number"
          text={row.priceNeorama + ""}
          onUpdate={updateHandler}
          item={row}
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
                Menu Items
              </p>
            </div>
          </div>
          <div className="h-full w-full">
            <div className="flex justify-end gap-x-4">
              <button
                onClick={() => setIsCreateItemDialogOpen(true)}
                className="my-3 bg-white rounded border border-gray-800 text-gray-800 px-6 py-2 text-sm"
              >
                Add
              </button>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="h-10 w-full text-sm leading-none text-gray-600">
                    {columns.map((column) => (
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
                      {columns.map((column) => {
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
      {isCreateItemDialogOpen && (
        <AddMenuItemDialog
          isOpen={isCreateItemDialogOpen}
          close={() => setIsCreateItemDialogOpen(false)}
          createItem={createItem}
        />
      )}
    </>
  );
}
