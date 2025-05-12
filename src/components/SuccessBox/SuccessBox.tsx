// Used on the Signup and Reset Password Page to show a Success Message after Submitting

import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import CheckboxIcon from "../Icons/Checkbox/CheckboxIcon";
import SubmitButton from "../NonDashboardComponents/FormElementsV2/SubmitButton";
import { Text } from "../Typography/Typography";

type SuccessBoxProps = {
  title: string;
  description: string;
  footer?: React.ReactNode;
};

const SuccessBox: FC<SuccessBoxProps> = ({ title, description, footer = <></> }) => {
  return (
    <Stack p="40px 36px" border="1px solid #E5E7EB" borderRadius="12px" gap="32px">
      <CheckboxIcon />
      <Stack gap="8px">
        <Typography fontWeight="700" fontSize="28px" lineHeight="40px" letterSpacing="-0.02em" color="#111827">
          {title}
        </Typography>
        <Text size="large" weight="regular" color="#6B7280">
          {description}
        </Text>
      </Stack>

      <Stack gap="20px">
        <SubmitButton href="/signin" loading={false}>
          Go to Login
        </SubmitButton>
        {footer}
      </Stack>
    </Stack>
  );
};

export default SuccessBox;
