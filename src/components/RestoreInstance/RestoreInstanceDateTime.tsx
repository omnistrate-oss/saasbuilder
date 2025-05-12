import { FC } from "react";
import { Box } from "@mui/material";

import AlertText from "../AlertText/AlertText";
import FieldContainer from "../FormElementsv2/FieldContainer/FieldContainer";
import FieldDescription from "../FormElementsv2/FieldDescription/FieldDescription";
import FieldError from "../FormElementsv2/FieldError/FieldError";
import FieldTitle from "../FormElementsv2/FieldTitle/FieldTitle";

import DateSelectComponent from "./DateSelectComponent";
import TimeSelectComponent from "./TimeSelectComponent";

type ResourceInstanceDateTimeProps = {
  formData: any;
  earliestRestoreTime: string;
};

const RestoreInstanceDateTime: FC<ResourceInstanceDateTimeProps> = ({ formData, earliestRestoreTime }) => {
  const { errors, touched } = formData;

  return (
    <Box position="relative">
      <FieldContainer>
        <FieldTitle>Select Date</FieldTitle>
        <FieldDescription sx={{ marginBottom: "6px" }}>
          Choose the date to which you want to restore your instance
        </FieldDescription>
        <DateSelectComponent formData={formData} />
        <FieldError>{touched.date && errors.date}</FieldError>
      </FieldContainer>

      <FieldContainer sx={{ marginTop: "34px" }}>
        <FieldTitle sx={{ marginBottom: "6px" }}>Select Time</FieldTitle>
        <FieldDescription sx={{ marginBottom: "6px" }}>
          Specify the exact time to restore your instance
        </FieldDescription>
        <TimeSelectComponent formData={formData} earliestRestoreTime={earliestRestoreTime} />
      </FieldContainer>

      <Box sx={{ marginTop: "48px" }}>
        <AlertText>
          <strong>Note : </strong> Creating a new instance from a backup may take a few minutes. However this process
          will not affect your current instance.
        </AlertText>
      </Box>
    </Box>
  );
};

export default RestoreInstanceDateTime;
