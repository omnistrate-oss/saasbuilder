import { FC, useEffect } from "react";
// import Autocomplete, {
//   StyledTextField,
// } from "../FormElementsv2/AutoComplete/AutoComplete";
import { Box, InputAdornment } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

import { dateToTimeString } from "src/utils/time";

import FieldError from "../FormElementsv2/FieldError/FieldError";
import TextField from "../FormElementsv2/TextField/TextField";
import ClockIcon from "../Icons/RestoreInstance/ClockIcon";
// import { getFilteredTimeOptions } from "src/utils/restore";
import TimePickerSlider from "../TimePickerSlider/TimePickerSlider";
import { Text } from "../Typography/Typography";

type TimeSelectComponentProps = {
  formData: any;
  earliestRestoreTime: string;
};

const TimeSelectComponent: FC<TimeSelectComponentProps> = ({ formData, earliestRestoreTime }) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } = formData;
  // const [filteredTimeOptions, setFilteredTimeOptions] = useState<string[]>([]);

  useEffect(() => {
    //whenever date changes reset time
    if (values.time) {
      const date = dayjs(new Date(earliestRestoreTime)).add(1, "minute").toDate();

      setFieldValue("time", dateToTimeString(date));
      // setFieldTouched("time", false);
    }
    // setFilteredTimeOptions(
    //   getFilteredTimeOptions(values.earliestRestoreTime, values.date)
    // );
    //eslint-disable-next-line
  }, [values.date]);

  //Set touched value to true so that errors if any are visible when using the slider
  useEffect(() => {
    setFieldTouched("time", true);
  }, []);

  function getLeftButtonDisableState() {
    const selectedDate: Dayjs = values.date;
    return selectedDate.subtract(1, "day").isBefore(new Date(earliestRestoreTime), "day");
  }

  function getRightButtonDisableState() {
    const selectedDate: Dayjs = values.date;
    return selectedDate.add(1, "day").isAfter(new Date(), "day");
  }

  function handleLeftButtonClick() {
    const date: Dayjs = values.date;
    const newDate = date.subtract(1, "day");
    setFieldValue("date", newDate);
  }

  function handleRightButtonClick() {
    const date: Dayjs = values.date;
    const newDate = date.add(1, "day");
    setFieldValue("date", newDate);
  }

  return (
    <>
      {/* <Autocomplete
        renderInput={(params: any) => (
          <StyledTextField
            {...params}
            placeholder={"hh:mm"}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ClockIcon />
                    <Text size="medium" weight="medium" color="#101828">
                      UTC
                    </Text>
                  </Box>
                </InputAdornment>
              ),
            }}
            name="time"
            id="time"
            error={!!touched.time && !!errors.time}
          />
        )}
        value={values.time}
        onChange={(e, newValue: string) => setFieldValue("time", newValue)}
        onBlur={() => setFieldTouched("time", true)}
        options={filteredTimeOptions}
        disableClearable
        freeSolo
      /> */}
      <TextField
        placeholder={"hh:mm"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ borderLeft: "none !important" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ClockIcon />
                <Text size="medium" weight="medium" color="#101828 !important">
                  UTC
                </Text>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "46px !important",
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-input": {
            paddingLeft: "6px",
          },
        }}
        name="time"
        id="time"
        error={!!touched.time && !!errors.time}
        value={values.time}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          setFieldValue("time", e.target.value)
        }
        onBlur={() => setFieldTouched("time", true)}
      />
      <FieldError marginTop="12px" sx={{ position: "absolute" }}>
        {touched.time && errors.time}
      </FieldError>
      <Box mt="50px">
        <TimePickerSlider
          setTimeValue={(newTimeValue) => {
            setFieldValue("time", newTimeValue);
          }}
          selectedTimeValue={values.time}
          disableLeftButton={getLeftButtonDisableState()}
          disableRightButton={getRightButtonDisableState()}
          handleRightButtonClick={handleRightButtonClick}
          handleLeftButtonClick={handleLeftButtonClick}
          earliestRestoreTime={earliestRestoreTime}
          selectedDate={values.date}
        />
      </Box>
    </>
  );
};

export default TimeSelectComponent;
