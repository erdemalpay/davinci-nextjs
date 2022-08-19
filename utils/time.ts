import { isToday, intervalToDuration } from "date-fns";
export function getDuration(
  dateString: string,
  startTime: string,
  finishTime?: string
) {
  const start = new Date(`${dateString} ${startTime}`);
  let end = new Date(`${dateString} ${finishTime}`);

  if (!finishTime) {
    if (isToday(new Date(dateString))) {
      end = new Date();
    } else {
      end = new Date(`${dateString} 23:59`);
    }
  }
  const { hours, minutes } = intervalToDuration({ start, end });

  return `${hours ? hours + "h " : ""}${minutes}m`;
}

export function getTimeString(date: Date) {
  const hours = date.getHours();
  let minutes = `${date.getMinutes()}`;
  minutes = minutes.length === 1 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}`;
}
