import { useQuery } from "react-query";
import { User } from "../../types";
import { get } from "../api";
import { useGenerateApi } from "./factory";

export function getCurrentUser(): Promise<User> {
  return get<User>({ path: "/users/me" });
}

const getUsersQuery = "/users";

export function getUser(): Promise<User> {
  return get<User>({ path: "/users/me" });
}

export function getActiveUsers(): Promise<User[]> {
  return get<User[]>({ path: getUsersQuery });
}

export function getAllUsers(): Promise<User[]> {
  return get<User[]>({
    path: `${getUsersQuery}?all=true`,
  });
}

export function useGetActiveUsers(initialUsers: User[]) {
  const { isLoading, error, data, isFetching } = useQuery(
    getUsersQuery,
    () => getActiveUsers(),
    {
      initialData: initialUsers,
    }
  );
  return {
    isLoading,
    error,
    users: data,
    isFetching,
  };
}

export function useGetAllUsers(initialUsers: User[]) {
  const { isLoading, error, data, isFetching } = useQuery(
    `${getUsersQuery}?all=true`,
    () => getAllUsers(),
    {
      initialData: initialUsers,
    }
  );
  return {
    isLoading,
    error,
    users: data,
    isFetching,
  };
}

export function useUsers(initialItems: User[] = []) {
  const { updateItem: updateUser, createItem: createUser } =
    useGenerateApi<User>({
      baseQuery: "/users",
      initialItems,
      fetchQuery: "/users?all=true",
    });

  return { updateUser, createUser };
}
