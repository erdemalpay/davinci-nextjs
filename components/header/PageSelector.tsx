import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
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
      path: `/${selectedLocationId}`,
    },
    {
      name: "Reservations",
      path: `/${selectedLocationId}/reservations`,
    },
    {
      name: "Gameplays",
      path: "/gameplays",
    },
    {
      name: "Games",
      path: "/games",
    },
    {
      name: "Memberships",
      path: "/memberships",
    },
    {
      name: "Users",
      path: "/users",
    },
    {
      name: "Visits",
      path: "/visits",
    },
    {
      name: "Menu",
      path: "/menu",
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
        {routes.map((route) => (
          <MenuItem
            key={route.name}
            onClick={() => {
              router.push(route.path);
            }}
          >
            {route.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
