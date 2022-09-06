import { GetStaticProps } from "next";
import type { User } from "../types";
import { getCurrentUser } from "../utils/api/user";
import { useQuery } from "react-query";

const path = "/user/profile";

export const getStaticProps: GetStaticProps = async () => {
  const user = await getCurrentUser();
  return { props: { user } };
};

export default function UserComponent({ user: initialUser }: { user: User }) {
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
