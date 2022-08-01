import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, Option, Input } from "@material-tailwind/react";
import { useGetGameplayAnalytics } from "../utils/api/gameplay";
import { useGetGames } from "../utils/api/game";
import { DateFilter, getStartEndDates } from "../utils/dateFilter";
import { useQueryClient } from "react-query";
import { colors } from "../utils/color";

export interface GameCount {
  name: string;
  count: number;
}

export function GameAnalyticChart() {
  const queryClient = useQueryClient();
  const [dateFilter, setDateFilter] = useState(DateFilter.LAST_MONTH);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string | undefined>("");
  const [itemLimit, setItemLimit] = useState(5);

  const { data: gameAnalytics } = useGetGameplayAnalytics(
    "game",
    itemLimit,
    startDate,
    endDate
  );
  const { games } = useGetGames([]);
  const [gameData, setGameData] = useState<GameCount[]>([]);

  useEffect(() => {
    if (!gameAnalytics) return;
    if (!games?.length) return;
    const data = gameAnalytics.map((gameplayAnalytic) => {
      const game = games.find((game) => game._id === gameplayAnalytic._id);
      return {
        name: game ? game.name : gameplayAnalytic._id,
        count: gameplayAnalytic.playCount,
      } as GameCount;
    });
    setGameData(data);
    console.log({ data });
  }, [gameAnalytics, games]);

  useEffect(() => {
    const { startDate, endDate } = getStartEndDates(dateFilter);
    setStartDate(startDate);
    setEndDate(endDate);
  }, [dateFilter]);

  useEffect(() => {
    console.log({ itemLimit });
    queryClient.invalidateQueries("/gameplays/query");
  }, [startDate, endDate, itemLimit, queryClient]);

  return (
    <div className="p-4 w-[600px] border-2 h-[140%]">
      <h1 className="text-xl mb-4">Gameplay By Games</h1>
      <div className="flex gap-2 w-full mb-4">
        <Select
          label="Number of items"
          variant="standard"
          value={itemLimit.toString()}
          onChange={(value) => {
            console.log({ value });
            setItemLimit(Number(value));
          }}
        >
          <Option value="5">5</Option>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
        </Select>
        <Select
          label="Date Range"
          className=""
          variant="standard"
          value={dateFilter.toString()}
          onChange={(value) => {
            console.log(value);
            setDateFilter(value as DateFilter);
          }}
        >
          <Option value="1">This Week</Option>
          <Option value="2">Last Week</Option>
          <Option value="3">This Month</Option>
          <Option value="4">Last Month</Option>
          <Option value="0">Manual</Option>
        </Select>
      </div>
      <div className="flex gap-2 w-full mb-4">
        <Input
          type="date"
          label="Start Date"
          variant="standard"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <Input
          type="date"
          variant="standard"
          label={`${endDate ? "End Date" : ""}`}
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          className={`${endDate ? "" : "hidden"}`}
        />
      </div>
      {gameData?.length ? (
        <ResponsiveContainer width={600} height={400}>
          <BarChart
            data={gameData}
            margin={{
              top: 50,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" label={{ position: "top" }}>
              {gameData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 10]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex w-full h-2/3 justify-center items-center border-2">
          <h1>No Data Available</h1>
        </div>
      )}
    </div>
  );
}
