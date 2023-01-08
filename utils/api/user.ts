import { Role, User } from "../../types";
import { get } from "../api";
import { useGetItems, useMutationApi, Paths } from "./factory";

export function getCurrentUser(): Promise<User> {
  return get<User>({ path: "/users/me" });
}

const getUsersQuery = "/users";

export function getUser(): Promise<User> {
  return get<User>({ path: "/users/me" });
}

export function useUserMutations() {
  const { updateItem: updateUser, createItem: createUser } =
    useMutationApi<User>({
      baseQuery: Paths.Users,
      fetchQuery: Paths.AllUsers,
    });

  return { updateUser, createUser };
}

export function useGetUsers() {
  return useGetItems<User>(Paths.Users, false);
}

export function useGetAllUsers() {
  return useGetItems<User>(Paths.AllUsers, false);
}

export function useGetAllUserRoles() {
  return useGetItems<Role>(`${Paths.Users}/roles`, false);
}
