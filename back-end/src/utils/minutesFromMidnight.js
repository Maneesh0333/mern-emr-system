export function minutesFromMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}