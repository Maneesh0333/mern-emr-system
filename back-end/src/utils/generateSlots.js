export function generateSlots(start, end, duration) {

  const slots = [];

  let startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (startTime < endTime) {

    const hours = startTime.getHours().toString().padStart(2, "0");
    const minutes = startTime.getMinutes().toString().padStart(2, "0");

    slots.push(`${hours}:${minutes}`);

    startTime = new Date(startTime.getTime() + duration * 60000);
  }

  return slots;
}