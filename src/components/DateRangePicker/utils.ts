import { addHours, addMinutes, addSeconds, format, isMatch } from "date-fns";
import dayjs from "dayjs";

//convert strings of format h:m:ss, h:mm:s i.e, strings which may contain single digits for h, m or s to format hh:mm:ss
export const padTimeStringtoTwoDigits = (time: string) => {
  if (!isMatch(time, "HH:mm:ss")) return time; //if format is not valid then return the string
  return time
    .split(":")
    .map((item) => item.padStart(2, "0"))
    .join(":");
};

//takes in start of start of date and time string in hh:mm:ss format and returns a datetime  object
export const getDateTime = (date: Date, time: string) => {
  const timeArr = time.split(":");
  let dateTime = addHours(date, +timeArr[0]);
  dateTime = addMinutes(dateTime, +timeArr[1]);
  dateTime = addSeconds(dateTime, +timeArr[2]);
  return dateTime;
};

//takes date part of any string and adds time string in hh:mm:ss format and join them to give utc time
export const getISOStringfromDateAndTime = (date: Date, time: string) => {
  const dateString = format(date, "yyyy-MM-dd");
  const timeString = padTimeStringtoTwoDigits(time);
  const isoDateTimeString = dateString + "T" + timeString + "Z";
  return new Date(isoDateTimeString).toISOString();
};

//get start of date in local time zone from date part of a utc string
export const getLocalStartOfDayfromISODateString = (ISOString: string) => {
  return new Date(
    dayjs(new Date(ISOString)).utc().get("year"),
    dayjs(new Date(ISOString)).utc().get("M"),
    dayjs(new Date(ISOString)).utc().get("date")
  );
};
