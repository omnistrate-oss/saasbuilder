import { FC } from "react";
import { SxProps, Theme } from "@mui/material";

import FieldLabel from "components/FormElements/FieldLabel/FieldLabel";
import FieldContainer from "components/FormElementsv2/FieldContainer/FieldContainer";
import FieldDescription from "components/FormElementsv2/FieldDescription/FieldDescription";
import FieldError from "components/FormElementsv2/FieldError/FieldError";

import {
  MultiSelectAutocomplete,
  PasswordInput,
  RadioField,
  SelectField,
  SingleSelectAutocomplete,
  TextInput,
} from "./Common";

type DynamicFieldProps = {
  field: any;
  formData: any;
  sx?: SxProps<Theme>;
};

const DynamicField: FC<DynamicFieldProps> = ({ field, formData, sx = {} }) => {
  const { type, isHidden, customComponent } = field;
  const { touched, errors } = formData;

  if (isHidden) {
    return null;
  }

  let Field: null | React.ReactNode = null;

  if (customComponent) {
    Field = customComponent;
  } else if (type === "text" || type === "description" || type === "number") {
    Field = <TextInput field={field} formData={formData} />;
  } else if (type === "password") {
    Field = <PasswordInput field={field} formData={formData} />;
  } else if (type === "select") {
    Field = <SelectField field={field} formData={formData} />;
  } else if (type === "radio") {
    Field = <RadioField field={field} formData={formData} />;
  } else if (type === "single-select-autocomplete") {
    Field = <SingleSelectAutocomplete field={field} formData={formData} />;
  } else if (type === "multi-select-autocomplete") {
    Field = <MultiSelectAutocomplete field={field} formData={formData} />;
  }

  return (
    <FieldContainer sx={sx}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      <FieldDescription>{field.description}</FieldDescription>

      {Field}

      <FieldError>{touched[field.name] && errors[field.name]}</FieldError>
    </FieldContainer>
  );
};

export default DynamicField;
