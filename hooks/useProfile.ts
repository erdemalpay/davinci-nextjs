import { useState } from "react";

export const useProfile = () => {
  const [user, setUser] = useState(null);

  return {
    name: "John Doe",
  };
};
