import { GameAnalyticChart } from "../components/analytics/GameAnalyticChart";
import { Header } from "../components/header/Header";
import { MentorAnalyticChart } from "../components/analytics/MentorAnalyticChart";
import { GetStaticProps } from "next";
import { fetchItems, Paths } from "../utils/api/factory";
import { Game } from "../types";
import { useCheckLogin } from "../hooks/useCheckLogin";

export const getStaticProps: GetStaticProps = async () => {
  const games = (await fetchItems<Game>(Paths.Games)) || [];
  games.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  return { props: { games } };
};

export default function Analytics({ games }: { games: Game[] }) {
  useCheckLogin();
  return (
    <>
      <Header showLocationSelector={false} />
      <div className="flex flex-col lg:flex-row justify-between w-full gap-4 py-2 h-[500px] px-2 lg:px-40">
        <GameAnalyticChart games={games} />
        <MentorAnalyticChart />
      </div>
    </>
  );
}
