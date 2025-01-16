"use client";

import { useState } from "react";
import Generator from "generate-password";
import { InputAdornment, Box, Stack } from "@mui/material";

import KeyIcon from "components/Icons/Key/KeyIcon";
import { Text } from "components/Typography/Typography";
import Select from "components/FormElementsv2/Select/Select";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import TextField from "components/FormElementsv2/TextField/TextField";

import { Field } from "./types";
import Tooltip from "../Tooltip/Tooltip";
import Radio, { RadioGroup } from "../FormElementsv2/Radio/Radio";
import FormControlLabel from "../FormElementsv2/FormControlLabel/FormControlLabel";
import Autocomplete from "../FormElementsv2/AutoComplete/AutoComplete";

export const PasswordInput = ({ field, formData }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TextField
      inputProps={{
        "data-testid": field.dataTestId || "",
      }}
      autoComplete="new-password"
      type={isPasswordVisible ? "text" : "password"}
      id={field.name}
      name={field.name}
      value={field.value || formData.values[field.name] || ""}
      onChange={(e) => {
        field.onChange?.(e);
        formData.handleChange(e);
      }}
      error={Boolean(
        formData.touched[field.name] && formData.errors[field.name]
      )}
      onBlur={(e) => {
        field.onBlur?.(e);
        formData.handleBlur(e);
      }}
      disabled={field.disabled}
      placeholder={field.placeholder}
      sx={{
        "& .MuiInputAdornment-root": {
          border: "none",
          paddingRight: 0,
        },
        mt: 0,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Text
              size="xsmall"
              weight="medium"
              style={{
                color: "#7F56D9",
                cursor: "pointer",
                userSelect: "none",
                paddingRight: "14px",
                width: "46px",
                textAlign: "center",
              }}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
            {field.showPasswordGenerator && (
              <Tooltip title="Password Generator" placement="top-end" arrow>
                <Box
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: "15px",
                    backgroundColor: "#F9F5FF",
                    height: "100%",
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "1px solid #D0D5DD",
                  }}
                  onClick={() => {
                    const password = Generator.generate({
                      length: 12,
                      numbers: true,
                    });

                    formData.setFieldValue(field.name, password);
                    field.onChange?.({
                      target: {
                        name: field.name,
                        value: password,
                      },
                    });
                  }}
                >
                  <KeyIcon />
                </Box>
              </Tooltip>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export const TextInput = ({
  field,
  formData,
}: {
  field: Field;
  formData: any;
}) => {
  const { values, touched, errors, handleChange, handleBlur } = formData;
  return (
    <TextField
      inputProps={{
        "data-testid": field.dataTestId || "",
      }}
      type={field.type === "number" ? "number" : "text"}
      id={field.name}
      name={field.name}
      value={field.value || values[field.name] || ""}
      onChange={(e) => {
        field.onChange?.(e);
        handleChange(e);
      }}
      error={Boolean(touched[field.name] && errors[field.name])}
      onBlur={(e) => {
        field.onBlur?.(e);
        handleBlur(e);
      }}
      disabled={field.disabled}
      {...(field.type === "description" && {
        multiline: true,
        minRows: 3,
        maxRows: 6,
      })}
      {...(field.type === "text-multiline" && {
        multiline: true,
        minRows: 1,
        maxRows: 3,
      })}
      placeholder={field.placeholder || ""}
      sx={{ mt: 0 }}
    />
  );
};

export const SelectField = ({ field, formData }) => {
  const { values, touched, errors, handleChange, handleBlur } = formData;
  return (
    <Select
      inputProps={{
        "data-testid": field.dataTestId || "",
      }}
      isLoading={field.isLoading}
      id={field.name}
      name={field.name}
      value={field.value || values[field.name] || ""}
      onBlur={(e) => {
        field.onBlur?.(e);
        handleBlur(e);
      }}
      onChange={(e) => {
        field.onChange?.(e);
        handleChange(e);
      }}
      error={Boolean(touched[field.name] && errors[field.name])}
      disabled={field.disabled}
      sx={{ mt: 0 }}
    >
      {field.menuItems?.length > 0 ? (
        field.menuItems.map((option) => {
          const menuItem = (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          );

          if (option.disabled && option.disabledMessage) {
            return (
              <Tooltip
                title={option.disabledMessage}
                key={option.value}
                placement="top"
              >
                <span>{menuItem}</span>
              </Tooltip>
            );
          }

          return menuItem;
        })
      ) : (
        <MenuItem value="" disabled>
          <i>{field.emptyMenuText || "No Options"}</i>
        </MenuItem>
      )}
    </Select>
  );
};

export const RadioField = ({ field, formData }) => {
  const { values, handleChange } = formData;
  return (
    <RadioGroup
      row
      name={field.name}
      value={field.value !== undefined ? field.value : values[field.name]} // For the case when value might be 'false'
      onChange={(e) => {
        field.onChange?.(e);
        handleChange(e);
      }}
    >
      {field.options.map((option) => (
        <FormControlLabel
          data-testid={field.dataTestId || ""}
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
};

export const SingleSelectAutocomplete = ({ field, formData }) => {
  return (
    <Autocomplete
      data-testid={field.dataTestId || ""}
      options={field.menuItems || []}
      name={field.name}
      value={field.value || ""}
      onChange={(e, newValue) => {
        field.onChange?.(e);
        formData.setFieldValue(field.name, newValue);
      }}
      onBlur={(e) => {
        field.onBlur?.(e);
        formData.setFieldTouched(field.name, true);
      }}
      disabled={field.disabled}
      getOptionLabel={(option) => String(option)}
      error={Boolean(
        formData.touched[field.name] && formData.errors[field.name]
      )}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};

export const MultiSelectAutocomplete = ({ field, formData }) => {
  return (
    <Autocomplete
      data-testid={field.dataTestId}
      multiple
      options={field.menuItems || []}
      name={field.name}
      value={field.value || field.values[field.name] || ""}
      onChange={(e, newValue) => {
        field.onChange?.(e);
        formData.setFieldValue(field.name, newValue);
      }}
      onBlur={() => {
        formData.setFieldTouched(field.name, true);
      }}
      disabled={field.disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      error={Boolean(
        formData.touched[field.name] && formData.errors[field.name]
      )}
    />
  );
};
