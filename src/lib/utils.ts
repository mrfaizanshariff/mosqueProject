// Converts a time string from 24-hour format (e.g., "14:30") to 12-hour format with AM/PM (e.g., "2:30 PM")
export function convert24To12Hour(time24: string): string {
  if (!/^\d{1,2}:\d{2}$/.test(time24)) return time24; // Return as is if format is invalid
  let [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

// Converts a time string from 12-hour format (e.g., "2:30 PM") to total minutes since midnight
export function convert12HourToMinutes(time12: string): number | null {
  // Match format like "2:30 PM" or "12:05 am"
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

// Converts a time string from 24-hour format (e.g., "14:30") to total minutes since midnight
export function convert24HourToMinutes(time24: string): number | null {
  if (!/^\d{1,2}:\d{2}$/.test(time24)) return null;
  const [hour, minute] = time24.split(":").map(Number);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
}
