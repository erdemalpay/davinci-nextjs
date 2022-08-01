import { GameAnalyticChart } from "../../components/GameAnalyticChart";
import { MentorAnalyticChart } from "../../components/MentorAnalyticChart";

export default function Analytics() {
  return (
    <div className="flex w-full gap-10 p-10 h-[500px]">
      <GameAnalyticChart />
      <MentorAnalyticChart />
    </div>
  );
}
