import { GetServerSideProps } from "next";
import { MenuCategory } from "../types";
import { FormEvent, useState } from "react";
import { Header } from "../components/header/Header";
import { TrashIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { EditableText } from "../components/common/EditableText";
import { generateServerSideApi } from "../utils/api/factory";
import { AddMenuCategoryDialog } from "../components/menu/AddCategoryDialog";
import { useCategories } from "../utils/api/category";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { getItems } = generateServerSideApi<MenuCategory>("/menu/categories");
  const initialCategories = await getItems(context);
  return { props: { initialCategories } };
};

export default function MenuCategories({
  initialCategories,
}: {
  initialCategories: MenuCategory[];
}) {
  const { categories, deleteCategory, updateCategory, createCategory } =
    useCategories(initialCategories);

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

  const columns = [
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
        <button onClick={() => deleteCategory(row._id)}>
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
                    {columns.map((column) => (
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
                      {columns.map((column) => {
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
      </div>
      {isCreateCategoryDialogOpen && (
        <AddMenuCategoryDialog
          isOpen={isCreateCategoryDialogOpen}
          close={() => setIsCreateCategoryDialogOpen(false)}
          createCategory={createCategory}
        />
      )}
    </>
  );
}
