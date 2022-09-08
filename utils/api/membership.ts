import { Membership } from "../../types/index";
import { Paths, useGetItems, useMutationApi } from "./factory";

export function useMembershipMutations() {
  const {
    deleteItem: deleteMembership,
    updateItem: updateMembership,
    createItem: createMembership,
  } = useMutationApi<Membership>({
    baseQuery: Paths.Memberships,
  });

  return { deleteMembership, updateMembership, createMembership };
}

export function useGetMemberships() {
  return useGetItems<Membership>(Paths.Memberships, false);
}
