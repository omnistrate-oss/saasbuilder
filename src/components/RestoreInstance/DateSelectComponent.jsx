import { useEffect, useState } from "react";
import CalenderIcon from "../Icons/RestoreInstance/CalenderIcon";
import { Text } from "../Typography/Typography";
import { Box, Popover, Stack, styled } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { shouldDisableDate } from "src/utils/restore";
import { colors } from "src/themeConfig";
import { styleConfig } from "src/providerConfig";
dayjs.extend(utc);

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  "&.Mui-highlighted": {
    backgroundColor: colors.blue50,
  },
  "&.Mui-highlighted.Mui-selected": {
    backgroundColor: colors.blue700,
    color: theme.palette.primary.contrastText,
  },
  "&.Mui-today": {
    border: `1px solid ${colors.blue700}`,
  },
  "&.MuiPickersDay-root.Mui-disabled:not(.Mui-selected)": {
    color: "#d5dce0",
  },
}));

const StyledDateInput = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  border: "1px solid #D0D5DD",
  boxShadow: "0px 1px 2px 0px #1018280D",
  borderRadius: "8px",
  padding: "10px 14px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "16px",
  height: "48px",
  "&.Mui-focused": {
    border: `2px solid  ${styleConfig.primaryBorder}`,
    // boxShadow:
    //   "0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  },

  "&.Mui-error": {
    border: `1px solid  ${theme.palette.error["300"]}`,
    "&.Mui-focused": {
      boxShadow:
        "0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
    },
  },
}));

//highlight the dates between earliest date and current date in UTC
const ServerDay = (props) => {
  const { earliestRestoreTime, day, outsideCurrentMonth, ...other } = props;
  const isHighlighted = !shouldDisableDate(day, earliestRestoreTime);
  const now = dayjs.utc();
  const isToday = now.isSame(day, "day");

  return (
    <HighlightedDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      className={`${isHighlighted ? "Mui-highlighted" : ""} ${isToday && "Mui-today"}`}
    />
  );
};

function DateSelectComponent({ formData }) {
  const { values, touched, errors, setFieldValue, setFieldTouched } = formData;
  const earliestRestoreTime = values.earliestRestoreTime;
  const selectedDate = values.date;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "date-input" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setFieldTouched("date", true);
    setAnchorEl(null);
  };

  const handleDateChange = (newValue, selectionState, selectedView) => {
    setFieldValue("date", newValue);
    if (selectedView === "day") {
      handleClose();
    }
  };

  useEffect(() => {
    formData.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.date]);

  return (
    <Box sx={{ position: "relative" }}>
      <StyledDateInput
        onClick={handleClick}
        aria-describedby={id}
        className={`${open && "Mui-focused"} ${touched.date && errors.date && "Mui-error"}`}
      >
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"8px"}
        >
          <CalenderIcon />
          <Text size="medium" weight="medium" color="#101828">
            UTC
          </Text>
        </Stack>
        <Text
          size="medium"
          weight="regular"
          color={selectedDate ? "#101828" : "#475467"}
        >
          {selectedDate ? selectedDate?.format("MM-DD-YYYY") : "mm-dd-yyyy"}
        </Text>
      </StyledDateInput>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            padding: "16px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              timezone="UTC"
              value={selectedDate}
              onChange={handleDateChange}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  earliestRestoreTime: earliestRestoreTime,
                },
              }}
              shouldDisableDate={(date) =>
                shouldDisableDate(date, earliestRestoreTime)
              }
              dayOfWeekFormatter={(date) => dayjs(date).format("ddd")}
              sx={{
                "& .MuiPickersYear-yearButton.Mui-selected": {
                  backgroundColor: "#0e5fb5",
                },
                "& .MuiPickersYear-yearButton.Mui-selected:hover": {
                  backgroundColor: "#0e5fb5",
                },
              }}
            />
          </LocalizationProvider>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "12px",
              marginLeft: "16px",
            }}
          >
            <Box
              sx={{
                width: "18px",
                height: "18px",
                borderRadius: "4px",
                background: colors.blue50,
              }}
            />

            <Text size="medium" weight="semibold" color="#344054">
              Point in time backup available
            </Text>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

export default DateSelectComponent;
