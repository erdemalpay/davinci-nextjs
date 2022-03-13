import { GetServerSideProps } from "next";
import Cookies from "js-cookie";

import { get } from "../utils/api";
import type { User } from "../types";
import { useQuery } from "react-query";
import { getToken } from "../utils/serverUtils";
import { getCurrentUser } from "../utils/api/user";

const path = "/user/profile";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser({ context });
  return { props: { user } };
};

export default function UserComponent({ user: initialUser }: { user: User }) {
  const token = Cookies.get("jwt");

  const { data, error } = useQuery(path, () => getCurrentUser(), {
    initialData: initialUser,
  });
  if (error) return <p>An error has occurred.</p>;
  if (!data) return <p>Loading...</p>;
  const user = data || initialUser;
  const { name, role } = user;
  return (
    <div>
      <h1>Name: {name}</h1>
      <h2>Role: {role}</h2>
    </div>
  );
}
