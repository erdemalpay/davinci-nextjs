import React from "react";
import type { Game } from "../types";

export function GameListItem({ game }: { game: Game }) {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {game.name}
      </th>
      <td className="py-4 px-6">{game.expansion}</td>
      <td className="py-4 px-6">-</td>
    </tr>
  );
}
