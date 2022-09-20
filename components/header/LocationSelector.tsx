import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
import { useRouter } from "next/router";
import { useGetLocations } from "../../utils/api/location";

export function LocationSelector() {
  const { selectedLocationId } = useContext(LocationContext);
  const locations = useGetLocations();
  const router = useRouter();
  if (!locations) return null;
  const selectedLocation = locations?.find(
    (location) => location._id === selectedLocationId
  );
  return (
    <>
      {locations.map((location) => (
        <button
          key={location._id}
          onClick={() => {
            router.push(`/${location._id}`);
          }}
          className={`text-sm ${
            selectedLocation?._id === location._id ? "border-2" : "border-0"
          } rounded p-2 text-white`}
        >
          {location.name}
        </button>
      ))}
    </>
  );
}
