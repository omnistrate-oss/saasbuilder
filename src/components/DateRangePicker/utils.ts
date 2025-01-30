import { addHours, addMinutes, addSeconds, format } from "date-fns";
import dayjs from "dayjs";

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
  const isoDateTimeString = dateString + "T" + time + "Z";
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
