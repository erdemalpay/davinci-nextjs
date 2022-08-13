import React from "react";

export function Pagination({
  page,
  startIndex,
  gameLimitPerPage,
  gamesCount,
  totalPages,
  handleClick,
}: {
  page: number;
  startIndex: number;
  gameLimitPerPage: number;
  gamesCount: number;
  totalPages: number;
  handleClick: (num: number) => void;
}) {
  return (
    <nav
      className="flex justify-between items-center p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {startIndex + 1}-{startIndex + gameLimitPerPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {gamesCount}
        </span>
      </span>
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handleClick(page - 2)}
          >
            Previous
          </button>
        </li>
        <li>
          <button
            className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handleClick(page - 1)}
          >
            {page === 1 ? "-" : page - 1}
          </button>
        </li>
        <li>
          <button
            aria-current="page"
            className="z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            onClick={() => handleClick(page)}
          >
            {page}
          </button>
        </li>
        <li>
          <button
            className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handleClick(page + 1)}
          >
            {page === totalPages ? "-" : page + 1}
          </button>
        </li>
        <li>
          <button
            className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handleClick(page + 2)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
