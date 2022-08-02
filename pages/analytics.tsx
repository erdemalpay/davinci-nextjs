import { GameAnalyticChart } from "../components/GameAnalyticChart";
import { Header } from "../components/Header";
import { MentorAnalyticChart } from "../components/MentorAnalyticChart";

export default function Analytics() {
  return (
    <>
      <Header showLocationSelector={false} />
      <div className="flex w-full gap-10 p-10 h-[500px] px-40">
        <GameAnalyticChart />
        <MentorAnalyticChart />
      </div>
    </>
  );
}
