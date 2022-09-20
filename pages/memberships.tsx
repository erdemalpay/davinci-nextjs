import { GetStaticProps } from "next";
import { Membership } from "../types";
import { FormEvent, useState } from "react";
import { Header } from "../components/header/Header";
import { CreateMembershipDialog } from "../components/memberships/CreateMembershipDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { EditableText } from "../components/common/EditableText";
import { dehydratedState, Paths } from "../utils/api/factory";
import {
  useGetMemberships,
  useMembershipMutations,
} from "../utils/api/membership";
import { useCheckLogin } from "../hooks/useCheckLogin";

export const getStaticProps: GetStaticProps = async () => {
  return dehydratedState([Paths.Memberships]);
};

export default function Memberships() {
  useCheckLogin();
  const { deleteMembership, updateMembership, createMembership } =
    useMembershipMutations();

  const memberships = useGetMemberships();

  const [isCreateMembershipDialogOpen, setIsCreateMembershipDialogOpen] =
    useState(false);
  function updateMembershipHandler(
    event: FormEvent<HTMLInputElement>,
    item?: Membership
  ) {
    if (!item) return;
    const target = event.target as HTMLInputElement;
    if (!target.value) return;

    updateMembership({
      id: item._id,
      updates: { [target.name]: target.value },
    });
    toast.success(`Membership ${item.name} updated`);
  }

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (row: Membership) => (
        <EditableText
          name="name"
          text={row.name}
          onUpdate={updateMembershipHandler}
          item={row}
        />
      ),
    },
    {
      id: "startDate",
      header: "Start Date",
      cell: (row: Membership) => (
        <EditableText
          name="startDate"
          text={row.startDate}
          onUpdate={updateMembershipHandler}
          item={row}
          type="date"
        />
      ),
    },
    {
      id: "endDate",
      header: "End Date",
      cell: (row: Membership) => (
        <EditableText
          name="endDate"
          text={row.endDate}
          onUpdate={updateMembershipHandler}
          item={row}
          type="date"
        />
      ),
    },
    {
      id: "delete",
      header: "Action",
      cell: (row: Membership) => (
        <button onClick={() => deleteMembership(row._id)}>
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
                Memberships
              </p>
            </div>
          </div>
          <div className="h-full w-full">
            <div className="flex justify-end gap-x-4">
              <button
                onClick={() => setIsCreateMembershipDialogOpen(true)}
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
                  {memberships?.map((membership) => (
                    <tr
                      key={membership._id}
                      className="h-10 text-sm leading-none text-gray-700 border-b border-t border-gray-200 bg-white hover:bg-gray-100"
                    >
                      {columns.map((column) => {
                        return (
                          <td key={column.id} className="">
                            {column.cell(membership)}
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
      {isCreateMembershipDialogOpen && (
        <CreateMembershipDialog
          isOpen={isCreateMembershipDialogOpen}
          close={() => setIsCreateMembershipDialogOpen(false)}
          createMembership={createMembership}
        />
      )}
    </>
  );
}
