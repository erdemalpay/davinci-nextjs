import { useQuery } from "react-query";
import { User } from "../../types";
import { get } from "../api";
import { PossibleContext } from "../token";

export function getCurrentUser({
  context,
}: PossibleContext = {}): Promise<User> {
  return get<User>({ path: "/users/me", context });
}

const getAllUsersQuery = "/users/all";

export function getUser(params?: PossibleContext): Promise<User> {
  return get<User>({ path: "/users/me", context: params?.context });
}

export function getUsers(params?: PossibleContext): Promise<User[]> {
  return get<User[]>({ path: getAllUsersQuery, context: params?.context });
}

export function useGetUsers(initialUsers: User[]) {
  const { isLoading, error, data, isFetching } = useQuery(
    getAllUsersQuery,
    () => getUsers(),
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
