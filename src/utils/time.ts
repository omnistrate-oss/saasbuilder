export function checkHHMMFormatting(time: string) {
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  return time.match(timeRegex);
}

//Accepts a date object as input. Returns a number b/w 0 and 1439
export function dateToUTCMinutes(date: Date): number {
  // Get hours and minutes from the date
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Calculate total minutes of the day
  return hours * 60 + minutes;
}

//Accepts a date object as input. Returns a time foratted in hh:mm format
export function dateToTimeString(date: Date): string {
  // Get hours and minutes
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Format hours and minutes as two-digit strings
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function formattedTimeStringToMinutes(time: string): number {
  // Validate input format
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const match = time.match(timeRegex);
  if (!match) {
    throw new Error("Invalid time format. Use 'hh:mm' format (24-hour clock).");
  }

  // Parse hours and minutes
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  // Convert to total minutes
  return hours * 60 + minutes;
}

export function minutesToFormattedTimeString(minutes: number): string {
  if (minutes < 0 || minutes > 1439) {
    throw new Error("Input must be a number between 0 and 1439.");
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = mins.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

//Return a UTC datetime string representing first day of current UTC month
export function getFirstDayOfUTCMonth(): string {
  const now = new Date();

  // Create a new date for the first day of the current month in UTC
  const firstDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
  );

  // Return the ISO string representation
  return firstDay.toISOString();
}

/**
 * Returns the UTC timestamp string representing the end of the current UTC day (23:59:59.999)
 * @returns {string} ISO string representation of the end of the current UTC day
 */
export function getEndOfCurrentUTCDay(): string {
  const now = new Date();

  // Create a new date for the end of the current day in UTC
  // Setting hours to 23, minutes to 59, seconds to 59, milliseconds to 999
  const endOfDay = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  // Return the ISO string representation
  return endOfDay.toISOString();
}

export function secondsPassedInCurrentUTCMonth(): number {
  // Get current UTC date and time
  const now = new Date();

  // Create a date for the first day of the current month in UTC
  const firstDayOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
  );

  // Calculate the difference in milliseconds
  const millisecondsPassed = now.getTime() - firstDayOfMonth.getTime();

  // Convert milliseconds to seconds
  const secondsPassed = Math.floor(millisecondsPassed / 1000);

  return secondsPassed;
}
