import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const getFilteredTimeOptions = (minDate, selectedDate) => {
  const now = dayjs.utc();

  const isSelectedSameAsEarliest = selectedDate
    ? selectedDate.isSame(minDate, "day")
    : false; //check if selected date is same is earliest excluding time

  const isSelectedSameAsToday = selectedDate
    ? selectedDate.isSame(now, "day")
    : false; //check if selected date is same is today excluding time

  const maxOptionsCount = 24;
  const options = [];
  let selectedDateClone = selectedDate
    ? selectedDate.clone()
    : now.startOf("day");

  if (isSelectedSameAsEarliest && isSelectedSameAsToday) {
    for (let i = 0; i < maxOptionsCount; i++) {
      if (
        selectedDateClone.isSameOrAfter(minDate) &&
        selectedDateClone.isSameOrBefore(now)
      ) {
        //add time option which is between minDate and now
        options.push(selectedDateClone.format("HH:mm"));
      } else if (
        // if difference between minDate and now is less than one hour then no options are possible
        //in this case add an extra option which falls after min date but the difference in duration is less than hour
        selectedDateClone.isSameOrAfter(minDate) &&
        selectedDateClone.diff(minDate, "hour") === 0
      ) {
        options.push(selectedDateClone.format("HH:mm"));
      }
      selectedDateClone = selectedDateClone.add(1, "hour");
    }
  } else if (isSelectedSameAsEarliest) {
    for (let i = 0; i < maxOptionsCount; i++) {
      if (selectedDateClone.isSameOrAfter(minDate)) {
        options.push(selectedDateClone.format("HH:mm"));
      }
      selectedDateClone = selectedDateClone.add(1, "hour");
    }
  } else if (isSelectedSameAsToday) {
    for (let i = 0; i < maxOptionsCount; i++) {
      if (selectedDateClone.isSameOrBefore(now)) {
        options.push(selectedDateClone.format("HH:mm"));
      }
      selectedDateClone = selectedDateClone.add(1, "hour");
    }
  } else {
    for (let i = 0; i < maxOptionsCount; i++) {
      options.push(selectedDateClone.format("HH:mm"));
      selectedDateClone = selectedDateClone.add(1, "hour");
    }
  }

  return options;
};

//function to disabled the date which is less than earliest date or greater than current date in UTC
export const shouldDisableDate = (date, earliestRestoreTime) => {
  const minDate = earliestRestoreTime;
  const now = dayjs.utc();
  const maxDate = now;
  return date?.isBefore(minDate, "day") || date?.isAfter(maxDate, "day");
};
