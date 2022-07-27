import { ReactNode } from "react";
export const Tooltip = ({
  message,
  children,
}: {
  message: string;
  children: ReactNode;
}) => {
  return (
    <div className="relative flex flex-col items-center group-tooltip">
      {children}
      <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-tooltip-hover:flex">
        <span className="text-center z-10 p-2 text-xs leading-none text-white bg-gray-600 shadow-lg rounded-md">
          {message}
        </span>
      </div>
    </div>
  );
};
