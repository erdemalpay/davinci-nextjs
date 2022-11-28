import { Paths, useGetItems, useMutationApi } from "./factory";
import { Reservation } from "../../types/index";
import { format } from "date-fns";
import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
import { SelectedDateContext } from "../../context/SelectedDateContext";

export function useReservationMutations() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const { updateItem: updateReservation, createItem: createReservation } =
    useMutationApi<Reservation>({
      baseQuery: Paths.Reservations,
      fetchQuery: `${
        Paths.Reservations
      }?location=${selectedLocationId}&date=${format(
        selectedDate!,
        "yyyy-MM-dd"
      )}`,
      needsRevalidate: false,
    });

  return { updateReservation, createReservation };
}

export function useReservationCallMutations() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const { updateItem: updateReservationCall } = useMutationApi<Reservation>({
    baseQuery: Paths.ReservationsCall,
    fetchQuery: `${
      Paths.Reservations
    }?location=${selectedLocationId}&date=${format(
      selectedDate!,
      "yyyy-MM-dd"
    )}`,
    needsRevalidate: false,
  });

  return { updateReservationCall };
}

export function useGetReservations() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  return useGetItems<Reservation>(
    `${Paths.Reservations}?location=${selectedLocationId}&date=${format(
      selectedDate!,
      "yyyy-MM-dd"
    )}`,
    false
  );
}
