import { Membership } from "../../types/index";
import { useGenerateApi } from "./factory";

export function useMemberships(initialItems: Membership[] = []) {
  const {
    items: memberships,
    deleteItem: deleteMembership,
    updateItem: updateMembership,
    createItem: createMembership,
  } = useGenerateApi<Membership>({
    baseQuery: "/memberships",
    initialItems,
  });

  return { memberships, deleteMembership, updateMembership, createMembership };
}
