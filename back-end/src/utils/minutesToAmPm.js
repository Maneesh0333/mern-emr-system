export function minutesToAmPm(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")} ${period}`;
}
