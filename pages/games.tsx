import { GetServerSideProps } from "next";
import type { Game } from "../types";

import { getGames } from "../utils/api/game";
import { useQuery } from "react-query";

const path = "/user/profile";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getGames({ context });
  return { props: { user } };
};

export default function Games({ games: initialGames }: { games: Game[] }) {
  const { data, error } = useQuery(path, () => getGames(), {
    initialData: initialGames,
  });
  if (error) return <p>An error has occurred.</p>;
  if (!data) return <p>Loading...</p>;
  const games = data || initialGames;
  // const { name, role } = user;
  return (
    <div>
      <h1>Name: {}</h1>
      <h2>Role: {}</h2>
    </div>
  );
}
