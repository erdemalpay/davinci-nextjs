import { Membership } from "../../types";
import { get, patch, post, remove, UpdatePayload } from ".";
import { PossibleContext } from "../token";
import { useMutation, useQuery, useQueryClient } from "react-query";

const getAllMembershipsQuery = "/memberships";

export function getMemberships(
  params?: PossibleContext
): Promise<Membership[]> {
  return get<Membership[]>({
    path: getAllMembershipsQuery,
    context: params?.context,
  });
}

export function createMembership(
  membershipDetails: Partial<Membership>
): Promise<Membership> {
  return post<Partial<Membership>, Membership>({
    path: `/memberships`,
    payload: membershipDetails,
  });
}

export function deleteMembership(id: number): Promise<Membership> {
  return remove<Membership>({
    path: `/memberships/${id}`,
  });
}

export function updateMembership({
  id,
  updates,
}: UpdatePayload<Membership>): Promise<Membership> {
  return patch<Partial<Membership>, Membership>({
    path: `/memberships/${id}`,
    payload: updates,
  });
}

export function useGetMemberships(initialMemberships: Membership[]) {
  const { isLoading, error, data, isFetching } = useQuery(
    getAllMembershipsQuery,
    () => getMemberships(),
    {
      initialData: initialMemberships,
    }
  );
  return {
    isLoading,
    error,
    memberships: data,
    isFetching,
  };
}

export function useCreateMembershipMutation() {
  const queryClient = useQueryClient();

  const membershipsQuery = "/memberships";
  return useMutation(createMembership, {
    // We are updating tables query data with new Membership
    onMutate: async (membershipDetails) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(membershipsQuery);

      // Snapshot the previous value
      const previousMemberships =
        queryClient.getQueryData<Membership[]>(membershipsQuery);

      const updatedMemberships = [
        ...(previousMemberships as Membership[]),
        membershipDetails,
      ];

      // Optimistically update to the new value
      queryClient.setQueryData(membershipsQuery, updatedMemberships);

      // Return a context object with the snapshotted value
      return { previousMemberships };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousMembershipContext = context as {
        previousMemberships: Membership[];
      };
      if (previousMembershipContext?.previousMemberships) {
        const { previousMemberships } = previousMembershipContext;
        queryClient.setQueryData<Membership[]>(
          membershipsQuery,
          previousMemberships
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(membershipsQuery);
    },
  });
}
export function useDeleteMembershipMutation() {
  const queryClient = useQueryClient();

  const membershipsQuery = "/memberships";
  return useMutation(deleteMembership, {
    // We are updating tables query data with new Membership
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(membershipsQuery);

      // Snapshot the previous value
      const previousMemberships =
        queryClient.getQueryData<Membership[]>(membershipsQuery) || [];

      const updatedMemberships = previousMemberships.filter(
        (membership) => membership._id !== id
      );

      // Optimistically update to the new value
      queryClient.setQueryData(membershipsQuery, updatedMemberships);

      // Return a context object with the snapshotted value
      return { previousMemberships };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousMembershipContext = context as {
        previousMemberships: Membership[];
      };
      if (previousMembershipContext?.previousMemberships) {
        const { previousMemberships } = previousMembershipContext;
        queryClient.setQueryData<Membership[]>(
          membershipsQuery,
          previousMemberships
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(membershipsQuery);
    },
  });
}
export function useUpdateMembershipMutation() {
  const queryClient = useQueryClient();

  const membershipsQuery = "/memberships";
  return useMutation(updateMembership, {
    // We are updating tables query data with new Membership
    onMutate: async ({ id, updates }: UpdatePayload<Membership>) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(membershipsQuery);

      // Snapshot the previous value
      const previousMemberships =
        queryClient.getQueryData<Membership[]>(membershipsQuery) || [];

      const updatedMemberships = [...previousMemberships];

      for (let i = 0; i < updatedMemberships.length; i++) {
        if (updatedMemberships[i]._id === id) {
          updatedMemberships[i] = { ...updatedMemberships[i], ...updates };
        }
      }

      // Optimistically update to the new value
      queryClient.setQueryData(membershipsQuery, updatedMemberships);

      // Return a context object with the snapshotted value
      return { previousMemberships };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousMembershipContext = context as {
        previousMemberships: Membership[];
      };
      if (previousMembershipContext?.previousMemberships) {
        const { previousMemberships } = previousMembershipContext;
        queryClient.setQueryData<Membership[]>(
          membershipsQuery,
          previousMemberships
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(membershipsQuery);
    },
  });
}
