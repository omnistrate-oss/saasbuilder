import { FC } from "react";
import { InputAdornment, Stack, Typography } from "@mui/material";
import { FormikProps } from "formik";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import SubmitButton from "src/components/NonDashboardComponents/FormElementsV2/SubmitButton";
import { SetState } from "src/types/common/reactGenerics";

import { useLastLoginDetails } from "../hooks/useLastLoginDetails";
import { Text } from "src/components/Typography/Typography";
import Link from "next/link";
import { IdentityProvider } from "src/types/identityProvider";

type LoginMethodStepProps = {
  setCurrentStep: SetState<number>;
  formData: FormikProps<{
    email: "";
    password: "";
  }>;
  identityProviders: IdentityProvider[];
  isPasswordLoginEnabled: boolean;
};

const LoginMethodStep: FC<LoginMethodStepProps> = (props) => {
  const { setCurrentStep, formData, identityProviders, isPasswordLoginEnabled } = props;
  const { setEmail } = useLastLoginDetails();

  console.log("identityProviders", identityProviders);
  console.log("isPasswordLoginEnabled", isPasswordLoginEnabled);

  function handleNextClick() {
    formData.validateForm().then((errors) => {
      const isEmailError = errors.email;
      if (isEmailError) {
        formData.setTouched({
          email: true,
        });
        return;
      }
    });
  }

  return (
    <Stack gap="30px">
      <FieldContainer>
        <FieldLabel>Welcome</FieldLabel>
        {/* @ts-ignore */}
        <TextField
          inputProps={{
            "data-testid": "email-input",
          }}
          name="email"
          id="email"
          placeholder="Enter your registered email"
          value={formData.values.email}
          onChange={formData.handleChange}
          onBlur={formData.handleBlur}
          error={formData.touched.email && formData.errors.email}
          helperText={formData.touched.email && formData.errors.email}
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  borderLeft: "1px solid #D5D7DA",
                  paddingLeft: "18px !important",
                  paddingRight: "18px !important",
                }}
              >
                <Text
                  size="medium"
                  weight="semibold"
                  style={{
                    color: "#414651",
                    cursor: "pointer",
                    userSelect: "none",
                    textAlign: "center",
                  }}
                  onClick={() => setCurrentStep(0)}
                >
                  Change{" "}
                </Text>
              </InputAdornment>
            ),
          }}
        />
      </FieldContainer>

      <Text size="small" weight="regular" sx={{ color: "#535862", textAlign: "center" }}>
        New to Omnistrate?{" "}
        <Link href="/signup" style={{ color: "#364152", fontWeight: 600 }}>
          Sign Up{" "}
        </Link>
      </Text>

      {/* <SubmitButton
        data-testid="next-button"
        type="button" // <- important: prevent form submission here
        onClick={handleNextClick}
        loading={false}
      >
        Next
      </SubmitButton> */}
    </Stack>
  );
};

export default LoginMethodStep;
