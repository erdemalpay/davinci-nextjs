import { useQuery } from "react-query";
import { User } from "../../types";
import { get } from "../api";
import { PossibleContext } from "../token";
import { useGenerateApi } from "./factory";

export function getCurrentUser({
  context,
}: PossibleContext = {}): Promise<User> {
  return get<User>({ path: "/users/me", context });
}

const getUsersQuery = "/users";

export function getUser(params?: PossibleContext): Promise<User> {
  return get<User>({ path: "/users/me", context: params?.context });
}

export function getActiveUsers(params?: PossibleContext): Promise<User[]> {
  return get<User[]>({ path: getUsersQuery, context: params?.context });
}

export function getAllUsers(params?: PossibleContext): Promise<User[]> {
  return get<User[]>({
    path: `${getUsersQuery}?all=true`,
    context: params?.context,
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
