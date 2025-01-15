import * as React from "react";
import Slider, { SliderThumb, sliderClasses } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowLeftCircleBrokenIcon from "../Icons/ArrowLeftCircleBroken/ArrowLeftCircleBroken";
import ArrowRightCircleBrokenIcon from "../Icons/ArrowRightCircleBroken/ArrowRightCircleBrokenIcon";
import {
  checkHHMMFormatting,
  dateToUTCMinutes,
  minutesToFormattedTimeString,
  formattedTimeStringToMinutes,
} from "src/utils/time";
import { getPercent } from "src/utils/calculatePercentage";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function getCustomMarkStyles() {
  const customMarksIndexes = [
    1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23,
  ];
  const styles: Record<string, object> = {};

  customMarksIndexes.forEach((index) => {
    styles[`& .${sliderClasses.mark}[data-index='${index}']`] = {
      height: "7px",
      backgroundColor: "#7F56D9",
      width: "1px",
      opacity: 0.7,
    };
  });
  return styles;
}

const disabledBarStyles = {
  height: "2px",
  background: "#E8E8E8",
  position: "absolute",
  top: "14px",
  pointerEvents: "none",
};

const TimeSlider = styled(Slider)(() => ({
  height: 3,
  padding: "13px 0",
  position: "relative",
  "& .MuiSlider-thumb": {
    height: 15,
    width: 15,
    backgroundColor: "#D92D20",
    border: "3px solid #FDA29B",
    "&::before": {
      boxShadow: "none",
    },
    transformStyle: "preserve-3d",
    zIndex: 5,
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0 0 0 15px rgba(182, 147, 246, 0.16)",
    },
  },
  "& .MuiSlider-track": {
    height: 2,
    color: "#B692F6",
  },
  "& .MuiSlider-rail": {
    color: "#B692F6",
    opacity: 1,
    height: 2,
  },
  "& .verticalLine": {
    height: "41px",
    width: "4px",
    backgroundColor: "#D92D20",
    border: "1px solid #FECDCA",
    transform: "translateZ(-10px)",
    borderRadius: "33px",
  },
  [`& .${sliderClasses.mark}`]: {
    height: "12px",
    backgroundColor: "#7F56D9",
    width: "1px",
  },

  [`& .${sliderClasses.markLabel}`]: {
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 600,
    marginTop: "7px",
    color: "#000000",
  },
  ...getCustomMarkStyles(),
}));

//eslint-disable-next-line
interface TimeSliderThumbComponentProps extends React.HTMLAttributes<unknown> {}

function TimeSliderThumbComponent(props: TimeSliderThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="verticalLine" />
    </SliderThumb>
  );
}

const marks = [
  {
    value: 0,
    label: "00:00 AM",
  },
  {
    value: 60,
    label: "",
  },
  {
    value: 120,
    label: "",
  },
  {
    value: 180,
    label: "",
  },
  {
    value: 240,
    label: "",
  },
  {
    value: 300,
    label: "",
  },
  {
    value: 360,
    label: "06:00 AM",
  },
  {
    value: 420,
    label: "",
  },
  {
    value: 480,
    label: "",
  },
  {
    value: 540,
    label: "",
  },
  {
    value: 600,
    label: "",
  },
  {
    value: 660,
    label: "",
  },
  {
    value: 720,
    label: "12:00 PM",
  },
  {
    value: 780,
    label: "",
  },
  {
    value: 840,
    label: "",
  },
  {
    value: 900,
    label: "",
  },
  {
    value: 960,
    label: "",
  },
  {
    value: 1020,
    label: "",
  },
  {
    value: 1080,
    label: "06:00 PM",
  },
  {
    value: 1140,
    label: "",
  },
  {
    value: 1200,
    label: "",
  },
  {
    value: 1260,
    label: "",
  },
  {
    value: 1320,
    label: "",
  },
  {
    value: 1380,
    label: "",
  },
  {
    value: 1439,
    label: "11:59 PM",
  },
];

type TimePickerSliderProps = {
  selectedTimeValue: string;
  /*eslint-disable-next-line*/
  setTimeValue: (newTimeValue: string) => void;
  disableRightButton: boolean;
  disableLeftButton: boolean;
  handleLeftButtonClick: () => void;
  handleRightButtonClick: () => void;
  earliestRestoreTime: string;
  selectedDate: Dayjs;
};

const TimePickerSlider: React.FC<TimePickerSliderProps> = (props) => {
  const {
    setTimeValue,
    selectedTimeValue,
    disableLeftButton,
    disableRightButton,
    handleLeftButtonClick,
    handleRightButtonClick,
    earliestRestoreTime,
    selectedDate,
  } = props;

  const [utcMinutes, setUTCMinutes] = React.useState(
    dateToUTCMinutes(new Date())
  );

  const earliestTimeMinutes = React.useMemo(() => {
    return dateToUTCMinutes(new Date(earliestRestoreTime));
  }, [earliestRestoreTime]);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      const minutes = dateToUTCMinutes(new Date());
      if (minutes !== utcMinutes) {
        setUTCMinutes(minutes);
      }
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
    //eslint-disable-next-line
  }, []);

  const earliestTimeDisabledBarStyles = React.useMemo(() => {
    let minutes = 0;
    if (earliestRestoreTime) {
      minutes = dateToUTCMinutes(new Date(earliestRestoreTime));
    }
    //calculate left and right;
    const percentageWidth = getPercent(minutes, 1440, false);
    const styles = {
      ...disabledBarStyles,
      left: "0%",
      right: `${100 - percentageWidth}%`,
    };
    return styles;
  }, [earliestRestoreTime]);

  const futureTimeDisabledBarStyles = React.useMemo(() => {
    //calculate left and right;
    const percentageWidth = getPercent(utcMinutes, 1440, false);
    const styles = {
      ...disabledBarStyles,
      left: `${percentageWidth}%`,
      right: "0%",
    };
    return styles;
  }, [utcMinutes]);

  const isSelectedDateSameAsEarliestTimeDate = React.useMemo(
    () => selectedDate?.isSame(dayjs.utc(earliestRestoreTime), "day"),
    [selectedDate, earliestRestoreTime]
  );

  const isSelectedDateSameAsToday = React.useMemo(
    () => selectedDate?.isSame(dayjs.utc(new Date()), "day"),
    [selectedDate]
  );

  function checkIfTimeInputIsValid(timeInput: string): boolean | undefined {
    function checkIfMinutesAreValid(minutes: number) {
      if (!isSelectedDateSameAsEarliestTimeDate && !isSelectedDateSameAsToday)
        return true;
      else if (
        isSelectedDateSameAsEarliestTimeDate &&
        isSelectedDateSameAsToday
      ) {
        if (minutes > earliestTimeMinutes && minutes <= utcMinutes) {
          return true;
        }
      } else if (
        isSelectedDateSameAsEarliestTimeDate &&
        !isSelectedDateSameAsToday
      ) {
        return minutes > earliestTimeMinutes;
      } else if (
        !isSelectedDateSameAsEarliestTimeDate &&
        isSelectedDateSameAsToday
      ) {
        return minutes <= utcMinutes;
      }
      return false;
    }
    if (checkHHMMFormatting(timeInput)) {
      const minutes = formattedTimeStringToMinutes(timeInput);
      return checkIfMinutesAreValid(minutes);
    }
  }

  return (
    <Stack direction="row">
      <Box flexShrink={0} flexGrow={0}>
        <IconButton
          size="small"
          sx={{ transform: "translateY(2px)" }}
          disabled={disableLeftButton}
          onClick={handleLeftButtonClick}
        >
          <ArrowLeftCircleBrokenIcon disabled={disableLeftButton} />
        </IconButton>
      </Box>
      <Box flexBasis={547} flexGrow={1} position="relative">
        <TimeSlider
          slots={{ thumb: TimeSliderThumbComponent }}
          min={0}
          max={1439}
          marks={marks}
          value={
            checkIfTimeInputIsValid(selectedTimeValue)
              ? formattedTimeStringToMinutes(selectedTimeValue)
              : earliestTimeMinutes
          }
          onChange={(e, newValue) => {
            const newTimeValue = minutesToFormattedTimeString(
              newValue as number
            );
            if (checkIfTimeInputIsValid(newTimeValue)) {
              setTimeValue(newTimeValue);
            }
          }}
        />
        {isSelectedDateSameAsEarliestTimeDate && (
          <Box
            sx={{
              ...earliestTimeDisabledBarStyles,
            }}
          />
        )}
        {isSelectedDateSameAsToday && (
          <Box
            sx={{
              ...futureTimeDisabledBarStyles,
            }}
          />
        )}
      </Box>
      <Box flexShrink={0} flexGrow={0}>
        <IconButton
          size="small"
          sx={{ transform: "translateY(2px)" }}
          disabled={disableRightButton}
          onClick={handleRightButtonClick}
        >
          <ArrowRightCircleBrokenIcon disabled={disableRightButton} />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default TimePickerSlider;
