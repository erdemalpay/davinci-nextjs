import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import { MenuIcon } from "@heroicons/react/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useRouter } from "next/router";

export function PageSelector() {
  const { selectedLocationId } = useContext(LocationContext);

  const routes = [
    {
      name: "Tables",
      path: `/home/${selectedLocationId}`,
    },
    {
      name: "Gameplays",
      path: "/gameplays",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
  ];

  const router = useRouter();

  return (
    <Menu>
      <MenuHandler>
        <button className="text-sm text-white">
          <MenuIcon className="h-5 w-5" />
        </button>
      </MenuHandler>
      <MenuList>
        <MenuItem
          onClick={() => {
            router.push(`/home/${selectedLocationId}`);
          }}
        >
          Tables
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push(`/gameplays`);
          }}
        >
          Gameplays
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push(`/analytics`);
          }}
        >
          Analytics
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
