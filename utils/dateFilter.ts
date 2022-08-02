import {
  endOfISOWeek,
  endOfMonth,
  format,
  startOfISOWeek,
  startOfMonth,
  subMonths,
  subWeeks,
} from "date-fns";

const DATE_FORMAT = "yyyy-MM-dd";

export enum DateFilter {
  THIS_WEEK = "1",
  LAST_WEEK = "2",
  THIS_MONTH = "3",
  LAST_MONTH = "4",
  MANUAL = "0",
}

export function getStartEndDates(filter: string) {
  const filterType = filter as DateFilter;
  let startDate = "";
  let endDate;
  if (filterType === DateFilter.THIS_WEEK) {
    startDate = format(startOfISOWeek(new Date()), DATE_FORMAT);
    endDate = undefined;
  } else if (filterType === DateFilter.LAST_WEEK) {
    startDate = format(startOfISOWeek(subWeeks(new Date(), 1)), DATE_FORMAT);
    endDate = format(endOfISOWeek(subWeeks(new Date(), 1)), DATE_FORMAT);
  } else if (filterType === DateFilter.THIS_MONTH) {
    startDate = format(startOfMonth(new Date()), DATE_FORMAT);
    endDate = undefined;
  } else if (filterType === DateFilter.LAST_MONTH) {
    startDate = format(startOfMonth(subMonths(new Date(), 1)), DATE_FORMAT);
    endDate = format(endOfMonth(subMonths(new Date(), 1)), DATE_FORMAT);
  } else if (filterType === DateFilter.MANUAL) {
  }
  return { startDate, endDate };
}
