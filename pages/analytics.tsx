import { GameAnalyticChart } from "../components/GameAnalyticChart";
import { Header } from "../components/Header";
import { MentorAnalyticChart } from "../components/MentorAnalyticChart";

export default function Analytics() {
  return (
    <>
      <Header showLocationSelector={false} />
      <div className="flex flex-col lg:flex-row justify-between w-full gap-4 py-2 h-[500px] px-2 lg:px-40">
        <GameAnalyticChart />
        <MentorAnalyticChart />
      </div>
    </>
  );
}
