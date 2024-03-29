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
import { useGetGameplayAnalytics } from "../../utils/api/gameplay";
import { DateFilter, getStartEndDates } from "../../utils/dateFilter";
import { useQueryClient } from "react-query";
import { colors } from "../../utils/color";
import { InputWithLabel } from "../common/InputWithLabel";
import { useGetUsers } from "../../utils/api/user";
import { EditableText } from "../common/EditableText";

export interface GameCount {
  name: string;
  count: number;
}

export function MentorAnalyticChart() {
  const queryClient = useQueryClient();
  const [dateFilter, setDateFilter] = useState(DateFilter.SINGLE_DAY);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string | undefined>("");
  const [location, setLocation] = useState<string>("1,2");
  const [itemLimit, setItemLimit] = useState(5);

  const { data: gameAnalytics } = useGetGameplayAnalytics(
    "mentor",
    itemLimit,
    startDate,
    location,
    endDate
  );
  const users = useGetUsers();
  const [mentorData, setMentorData] = useState<GameCount[]>([]);

  useEffect(() => {
    if (!gameAnalytics) return;
    if (!users?.length) return;
    const data = gameAnalytics.map((gameplayAnalytic) => {
      const game = users.find((user) => user._id === gameplayAnalytic._id);
      return {
        name: game ? game.name : gameplayAnalytic._id,
        count: gameplayAnalytic.playCount,
      } as GameCount;
    });
    setMentorData(data);
  }, [gameAnalytics, users]);

  useEffect(() => {
    if (dateFilter === DateFilter.MANUAL) return;
    const { startDate, endDate } = getStartEndDates(dateFilter);
    setStartDate(startDate);
    setEndDate(endDate);
  }, [dateFilter]);

  useEffect(() => {
    queryClient.invalidateQueries("/gameplays/query");
  }, [startDate, endDate, itemLimit, queryClient]);

  return (
    <div className="p-4 pb-[200px] w-auto lg:w-1/2 border-2 h-[140%]">
      <h1 className="text-xl mb-4">Gameplay By Game Mentors</h1>
      <div className="flex flex-col w-1/2 mb-4">
        <label className="flex items-center text-xs">Date Filter:</label>
        <select
          onChange={(value) => setDateFilter(value.target.value as DateFilter)}
          className="py-2 border-b-[1px] border-b-grey-300 focus:outline-none text-sm"
          value={dateFilter}
        >
          <option value="1">Single Day</option>
          <option value="2">This Week</option>
          <option value="3">Last Week</option>
          <option value="4">This Month</option>
          <option value="5">Last Month</option>
          <option value="0">Manual</option>
        </select>
      </div>
      <div className="flex gap-2 w-full mb-4">
        <InputWithLabel
          type="date"
          name="Start Date"
          label="Start Date"
          value={startDate}
          onChange={(event) => {
            setStartDate((event.target as HTMLInputElement).value);
            if (dateFilter === DateFilter.SINGLE_DAY) {
              setEndDate((event.target as HTMLInputElement).value);
            } else {
              setDateFilter(DateFilter.MANUAL);
            }
          }}
        />
        <InputWithLabel
          type="date"
          name="End Date"
          label="End Date"
          value={endDate}
          onChange={(event) => {
            setEndDate((event.target as HTMLInputElement).value);
            setDateFilter(DateFilter.MANUAL);
          }}
          hidden={!endDate || dateFilter === DateFilter.SINGLE_DAY}
        />
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col w-1/2">
          <label className="flex items-center text-xs ">Location:</label>
          <select
            onChange={(value) => setLocation(value.target.value)}
            className="py-2 border-b-[1px] border-b-grey-300 focus:outline-none text-sm"
            defaultValue="Canada"
          >
            <option value="1,2">All</option>
            <option value="1">Bahçeli</option>
            <option value="2">Neorama</option>
          </select>
        </div>
        <div className="flex flex-col w-1/2">
          <label className="flex items-center text-xs">Number of items:</label>
          <EditableText
            name="name"
            type="number"
            text={itemLimit.toString()}
            onUpdate={(event) =>
              setItemLimit(Number((event.target as HTMLInputElement).value))
            }
            item={itemLimit}
            inactiveStyle="border-b-[1px]"
          />
        </div>
      </div>
      {mentorData?.length ? (
        <ResponsiveContainer className={"w-[600px] h-[400px]"}>
          <BarChart
            data={mentorData}
            margin={{
              top: 50,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" label={{ position: "top" }}>
              {mentorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 10]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex w-full h-2/3 justify-center items-center border-2 mt-4">
          <h1>No Data Available</h1>
        </div>
      )}
    </div>
  );
}
