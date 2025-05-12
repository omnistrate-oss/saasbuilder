import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as yup from "yup";
dayjs.extend(utc);

export const restoreFormikSchema = yup.object({
  earliestRestoreTime: yup.string().nullable(),
  date: yup.date().required("Date is required").nullable(),
  time: yup
    .string()
    .required("Time is required")
    .test("is-valid", "Invalid value for 24 Hrs time format", function (time) {
      const regexToMatchTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
      return time ? regexToMatchTime.test(time) : true;
    })
    .test("is-future-time", "Can't select time in future", function (time) {
      const earliestRestoreTime = dayjs.utc(this.parent.earliestRestoreTime);
      const selectedDate = this.parent.date
        ? dayjs.utc(this.parent.date)
        : null;
      if (!time || !selectedDate) return true;

      const now = dayjs.utc();
      const selectedDateString = selectedDate.format("YYYY-MM-DD");
      const isSelectedSameAsToday = now.isSame(selectedDate, "day");
      if (!isSelectedSameAsToday) return true;

      const currentDateTimeOption = dayjs.utc(
        selectedDateString + "T" + time + "Z"
      );

      const isSelectedSameAsEarliest = earliestRestoreTime
        ? selectedDate.isSame(selectedDate, "day")
        : false;

      //this check is required to allow one condition where the earliest date, current date and selected date are all same and
      //selected date time falls within an hour after earliest time and
      //also falls after current time
      // in this case we can let user enter a time option where it fall within an hour after earliest time but also greater than current time
      if (
        isSelectedSameAsEarliest &&
        currentDateTimeOption.isSameOrAfter(earliestRestoreTime) &&
        currentDateTimeOption.diff(earliestRestoreTime, "hour") === 0
      ) {
        return true;
      }

      return currentDateTimeOption.isSameOrBefore(now);
    })
    .test(
      "is-time-past-earliest-restore-time",
      "No snapshot available on or before selected time",
      function (time) {
        const earliestRestoreTime = dayjs.utc(this.parent.earliestRestoreTime);
        const selectedDate = this.parent.date
          ? dayjs.utc(this.parent.date)
          : null;
        if (!time || !selectedDate) return true;

        const selectedDateString = selectedDate.format("YYYY-MM-DD");
        const isSelectedSameAsEarliest = earliestRestoreTime.isSame(
          selectedDate,
          "day"
        );
        if (!isSelectedSameAsEarliest) return true;
        const currentDateTimeOption = dayjs.utc(
          selectedDateString + "T" + time + "Z"
        );

        return currentDateTimeOption.isSameOrAfter(earliestRestoreTime);
      }
    )
    .nullable(),
});
