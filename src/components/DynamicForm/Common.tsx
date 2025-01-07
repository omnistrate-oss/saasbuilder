"use client";

import { useState } from "react";
import Generator from "generate-password";
import { InputAdornment, Box } from "@mui/material";

import KeyIcon from "components/Icons/Key/KeyIcon";
import { Text } from "components/Typography/Typography";
import Select from "components/FormElementsv2/Select/Select";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import TextField from "components/FormElementsv2/TextField/TextField";

import { Field } from "./types";
import Tooltip from "../Tooltip/Tooltip";

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
      value={field.value || formData.values[field.name]}
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
      value={field.value || values[field.name]}
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
      placeholder={field.placeholder || ""}
    />
  );
};

export const SelectField = ({ field, formData }) => {
  const { values, touched, errors, handleChange, handleBlur } = formData;
  return (
    <Select
      selectProps={{
        "data-testid": field.dataTestId || "",
      }}
      isLoading={field.isLoading}
      id={field.name}
      name={field.name}
      value={field.value || values[field.name]}
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
    >
      {field.menuItems?.length > 0 ? (
        field.menuItems.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          <i>{field.emptyMenuText}</i>
        </MenuItem>
      )}
    </Select>
  );
};
