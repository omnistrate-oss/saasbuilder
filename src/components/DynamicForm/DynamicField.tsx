import { FC } from "react";
import { SxProps, Theme, Stack } from "@mui/material";

import FieldLabel from "components/FormElements/FieldLabel/FieldLabel";
import FieldError from "components/FormElementsv2/FieldError/FieldError";
import Radio, { RadioGroup } from "components/FormElementsv2/Radio/Radio";
import Autocomplete from "components/FormElementsv2/AutoComplete/AutoComplete";
import FieldContainer from "components/FormElementsv2/FieldContainer/FieldContainer";
import FieldDescription from "components/FormElementsv2/FieldDescription/FieldDescription";
import FormControlLabel from "components/FormElementsv2/FormControlLabel/FormControlLabel";
import { PasswordInput, SelectField, TextInput } from "./Common";

type DynamicFieldProps = {
  field: any;
  formData: any;
  sx?: SxProps<Theme>;
};

const DynamicField: FC<DynamicFieldProps> = ({ field, formData, sx = {} }) => {
  const {
    type,
    name,
    value,
    menuItems = [],
    options = [],
    isHidden,
    dataTestId = "",
    customComponent,
  } = field;
  const { values, handleChange, touched, errors } = formData;

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
  } else if (type === "single-select-autocomplete") {
    Field = (
      <Autocomplete
        data-testid={dataTestId}
        options={menuItems}
        name={name}
        value={value}
        onChange={(e, newValue) => {
          field.onChange?.(e);
          formData.setFieldValue(name, newValue);
        }}
        onBlur={(e) => {
          field.onBlur?.(e);
          formData.setFieldTouched(name, true);
        }}
        disabled={field.disabled}
        getOptionLabel={(option) => option}
        error={Boolean(touched[name] && errors[name])}
      />
    );
  } else if (type === "multi-select") {
    Field = (
      <Autocomplete
        data-testid={dataTestId}
        multiple
        options={menuItems}
        name={name}
        value={value || values[name]}
        onChange={(e, newValue) => {
          field.onChange?.(e);
          formData.setFieldValue(name, newValue);
        }}
        onBlur={() => {
          formData.setFieldTouched(name, true);
        }}
        disabled={field.disabled}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        error={Boolean(touched[name] && errors[name])}
      />
    );
  } else if (type === "radio") {
    Field = (
      <RadioGroup
        row
        name={name}
        value={value !== undefined ? value : values[name]} // For the case when value might be 'false'
        onChange={(e) => {
          field.onChange?.(e);
          handleChange(e);
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            data-testid={dataTestId}
            control={<Radio />}
            key={option.value}
            value={option.value}
            label={
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                gap="2px"
              >
                {option.label}
                {option.labelChips?.map((item) => item)}
              </Stack>
            }
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    );
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
