import { GetStaticProps } from "next";
import { User } from "../types";
import { FormEvent, useState } from "react";
import { Header } from "../components/header/Header";
import { CreateUserDialog } from "../components/users/CreateUserDialog";
// import { TrashIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { EditableText } from "../components/common/EditableText";
import { useGetAllUsers, useUserMutations } from "../utils/api/user";
import { Switch } from "@headlessui/react";
import { CheckSwitch } from "../components/common/CheckSwitch";
import { dehydratedState, Paths } from "../utils/api/factory";
import { useCheckLogin } from "../hooks/useCheckLogin";
import { Chip } from "@material-tailwind/react";
import { EditableUserRole } from "../components/common/EditableUserRole";

export const getStaticProps: GetStaticProps = async () => {
  return dehydratedState([Paths.AllUsers]);
};

export default function Users() {
  useCheckLogin();
  const { updateUser, createUser } = useUserMutations();
  const users = useGetAllUsers();
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  function updateUserHandler(event: FormEvent<HTMLInputElement>, item?: User) {
    if (!item) return;
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    updateUser({
      id: item._id,
      updates: { [target.name]: target.value },
    });
    toast.success(`User ${item.name} updated`);
  }

  function handleUserUpdate(user: User) {
    updateUser({
      id: user._id,
      updates: { active: !user.active },
    });
    toast.success(`User ${user.name} updated`);
  }

  const columns = [
    {
      id: "ID",
      header: "ID",
      visible: true,
      cell: (row: User) => <h1>{row._id}</h1>,
    },
    {
      id: "name",
      header: "Name",
      visible: true,
      cell: (row: User) => (
        <EditableText
          name="name"
          text={row.name}
          onUpdate={updateUserHandler}
          item={row}
        />
      ),
    },
    {
      id: "role",
      header: "Role",
      visible: true,
      cell: (row: User) => (
        <div className="flex flex-wrap gap-4 mt-2 w-1/2" id="roles">
          <EditableUserRole userId={row._id} item={row.role} />
        </div>
      ),
    },
    {
      id: "active",
      header: "Active",
      visible: showInactiveUsers,
      cell: (row: User) => (
        <CheckSwitch
          checked={row.active}
          onChange={() => handleUserUpdate(row)}
        ></CheckSwitch>
      ),
    },
    /* {
      id: "delete",
      header: "Action",
      cell: (row: User) => (
        <button onClick={() => deleteUser(row._id)}>
          <TrashIcon className="text-red-500 w-6 h-6" />
        </button>
      ),
    }, */
  ];

  return (
    <>
      <Header showLocationSelector={false} />

      <div className="flex flex-col gap-4 mx-0 lg:mx-20">
        <div className="bg-white shadow w-full px-6 py-5 mt-4">
          <div className="mb-5 rounded-tl-lg rounded-tr-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base lg:text-2xl font-bold leading-normal text-gray-800">
                Users
              </p>
            </div>
          </div>
          <div className="h-full w-full">
            <div className="flex justify-end gap-x-4">
              <button
                onClick={() => setIsCreateUserDialogOpen(true)}
                className="my-3 bg-white rounded border border-gray-800 text-gray-800 px-6 py-2 text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex justify-end gap-4 items-center">
              <h1 className="text-md">Show Inactive Users</h1>
              <Switch
                checked={showInactiveUsers}
                onChange={() => setShowInactiveUsers((value) => !value)}
                className={`${showInactiveUsers ? "bg-green-500" : "bg-red-500"}
          relative inline-flex h-[20px] w-[36px] border-[1px] cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    showInactiveUsers ? "translate-x-4" : "translate-x-0"
                  }
            pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="h-10 w-full text-sm leading-none text-gray-600">
                    {columns.map(
                      (column) =>
                        column.visible && (
                          <th key={column.id} className="font-bold text-left">
                            <div className="flex gap-x-2">{column.header}</div>
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody className="w-full">
                  {users
                    ?.filter((user) => showInactiveUsers || user.active)
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="h-10 text-sm leading-none text-gray-700 border-b border-t border-gray-200 bg-white hover:bg-gray-100"
                      >
                        {columns.map((column) => {
                          return (
                            column.visible && (
                              <td key={column.id} className="">
                                {column.cell(user)}
                              </td>
                            )
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
      {isCreateUserDialogOpen && (
        <CreateUserDialog
          isOpen={isCreateUserDialogOpen}
          close={() => setIsCreateUserDialogOpen(false)}
          createUser={createUser}
        />
      )}
    </>
  );
}
