import { User } from "../../types";
import { get } from "../api";
import { PossibleContext } from "../token";

export function getCurrentUser({
  context,
}: PossibleContext = {}): Promise<User> {
  return get<User>({ path: "/users/me", context });
}

export function getUsers({ context }: PossibleContext): Promise<User[]> {
  return get<User[]>({ path: "/users/all", context });
}
