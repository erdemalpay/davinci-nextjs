import { useMutation, useQuery, useQueryClient } from "react-query";
import { Visit } from "../../types";
import { get, patch, post } from ".";
import { PossibleContext } from "../token";
import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
import { SelectedDateContext } from "../../context/SelectedDateContext";
import { format } from "date-fns";
import { useLocation } from "../../hooks/useLocation";

interface UpdateVisitPayload {
  id: number;
}

// This is only called on server side in ServerSideProps
export function getVisits({ context }: PossibleContext): Promise<Visit[]> {
  const location = Number(context?.params?.location);
  return get<Visit[]>({
    path: `/visits?location=${location}&date=${format(
      new Date(),
      "yyyy-MM-dd"
    )}`,
    context,
  });
}

export function createVisit(visit: Partial<Visit>): Promise<Visit> {
  return post<Partial<Visit>, Visit>({
    path: `/visits`,
    payload: visit,
  });
}

export function finishVisit({ id }: UpdateVisitPayload): Promise<Visit> {
  return patch<Partial<Visit>, Visit>({
    path: `/visits/${id}`,
    payload: {},
  });
}

export function useGetVisits(initialVisits: Visit[]) {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const query = `/visits?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;

  const { isLoading, error, data, isFetching } = useQuery(
    query,
    () => get<Visit[]>({ path: query }),
    {
      initialData: initialVisits,
    }
  );
  return {
    isLoading,
    error,
    visits: data,
    isFetching,
  };
}

export function useCreateVisitMutation() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const queryClient = useQueryClient();
  const visitsQuery = `/visits?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;
  return useMutation(createVisit, {
    // We are updating visits query data with new visit
    onMutate: async (newVisit) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(visitsQuery);

      // Snapshot the previous value
      const previousVisits = queryClient.getQueryData<Visit[]>(visitsQuery);

      const updatedVisits = [...(previousVisits as Visit[]), newVisit];

      // Optimistically update to the new value
      queryClient.setQueryData(visitsQuery, updatedVisits);

      // Return a context object with the snapshotted value
      return { previousVisits };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newVisit, context) => {
      const previousVisitContext = context as { previousVisits: Visit[] };
      if (previousVisitContext?.previousVisits) {
        const { previousVisits } = previousVisitContext;
        queryClient.setQueryData<Visit[]>(visitsQuery, previousVisits);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(visitsQuery);
    },
  });
}

export function useFinishVisitMutation() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const queryClient = useQueryClient();
  const visitsQuery = `/visits?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;
  return useMutation(finishVisit, {
    // We are updating visits query data with new visit
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(visitsQuery);

      // Snapshot the previous value
      const previousVisits =
        queryClient.getQueryData<Visit[]>(visitsQuery) || [];

      const updatedVisits = [...previousVisits];

      for (let i = 0; i < updatedVisits.length; i++) {
        if (updatedVisits[i]._id === id) {
          updatedVisits[i] = {
            ...updatedVisits[i],
            finishHour: format(new Date(), "HH:mm"),
          };
        }
      }

      // Optimistically update to the new value
      queryClient.setQueryData(visitsQuery, updatedVisits);

      // Return a context object with the snapshotted value
      return { previousVisits };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newVisit, context) => {
      const previousVisitContext = context as { previousVisits: Visit[] };
      if (previousVisitContext?.previousVisits) {
        const { previousVisits } = previousVisitContext;
        queryClient.setQueryData<Visit[]>(visitsQuery, previousVisits);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(visitsQuery);
    },
  });
}
