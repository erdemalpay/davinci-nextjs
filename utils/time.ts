export function getDuration(
  date: Date,
  startTime: string,
  finishTime?: string
) {
  const start = new Date();
  const finish = new Date();
  if (date.toDateString() !== new Date().toDateString()) {
    start.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    finish.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const [startHour, startMinute] = startTime.split(":");
  start.setHours(Number(startHour), Number(startMinute), 0, 0);
  if (finishTime) {
    const [finishHour, finishMinute] = finishTime.split(":");
    finish.setHours(Number(finishHour), Number(finishMinute), 0, 0);
  } else {
    finish.setHours(24, 0, 0, 0);
  }
  let duration = finish.getTime() - start.getTime();
  if (duration < 0) {
    duration += 24 * 60 * 60 * 1000;
  }
  const durationMinute = Math.floor(duration / (60 * 1000));
  const hours = Math.floor(durationMinute / 60);
  let minutes = `${durationMinute % 60}`;

  if (minutes.length === 1) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

export function getTimeString(date: Date) {
  const hours = date.getHours();
  let minutes = `${date.getMinutes()}`;
  minutes = minutes.length === 1 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}`;
}
