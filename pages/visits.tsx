import { format, startOfMonth } from "date-fns";

import { useState } from "react";
import { MonthlyBody, MonthlyDay } from "../components/calendar/MonthlyBody";
import {
  MonthlyCalendar,
  MonthlyNav,
} from "../components/calendar/MonthlyCalendar";
import { VisitEventItem } from "../components/calendar/MonthlyEventItems";
import { Header } from "../components/Header";
import { Visit } from "../types";
import { useGetMonthlyVisits, useGetVisits } from "../utils/api/visit";

export default function Analytics() {
  let [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  let [location, setLocation] = useState<number>(1);

  const { visits } = useGetMonthlyVisits(
    location,
    format(currentMonth, "yyyy-MM")
  );

  return (
    <>
      <Header showLocationSelector={false} />

      <div className="mx-[20px]">
        <div className="flex flex-end w-1/2">
          <label className="flex items-center">Location:</label>
          <select
            onChange={(value) => setLocation(Number(value.target.value))}
            className="py-2border-b-grey-300 focus:outline-none text-sm"
            value={location}
          >
            <option value={1}>Bahçeli</option>
            <option value={2}>Neorama</option>
          </select>
        </div>
        <MonthlyCalendar
          currentMonth={currentMonth}
          onCurrentMonthChange={(date) => setCurrentMonth(date)}
        >
          <MonthlyNav />
          <MonthlyBody<Visit> events={visits || []}>
            <MonthlyDay<Visit>
              renderDay={(data) =>
                data.map((visit) => (
                  <VisitEventItem key={visit._id} visit={visit} />
                ))
              }
            />
          </MonthlyBody>
        </MonthlyCalendar>
      </div>
    </>
  );
}
