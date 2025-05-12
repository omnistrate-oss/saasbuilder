import { roundNumberToInteger } from "./formatNumber";

export const getPercent = (value: number, total: number, roundOff = true): number => {
  if (isNaN(value)) {
    return 0;
  }
  if (isNaN(total)) {
    return 0;
  }

  if (total === 0) {
    return 0;
  }

  const percentage = (value / total) * 100;

  if (roundOff) {
    return roundNumberToInteger(percentage);
  } else {
    // Return the result based on whether it's a whole number or not
    return percentage % 1 === 0 ? percentage : parseFloat(percentage.toFixed(2));
  }
};
