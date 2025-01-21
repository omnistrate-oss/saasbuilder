import { FC } from "react";
import Link from "next/link";
import { Box, Stack } from "@mui/material";

import { colors } from "src/themeConfig";
import { Text } from "components/Typography/Typography";
import ChevronRightIcon from "components/Icons/ChevronRight/ChevronRightIcon";

type StyledListItemProps = {
  text: string;
  link: string;
  linkText?: string;
};

export const StyledListItem: FC<StyledListItemProps> = (props) => {
  const { text, link, linkText = "Click here" } = props;

  return (
    <Stack direction="row" alignItems="center" gap="4px">
      <ChevronRightIcon />

      <Text size="small" weight="regular" color="#6f7174">
        {text}{" "}
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "underline",
            color: colors.purple700,
            fontWeight: 500,
          }}
          tabIndex={-1}
        >
          {linkText}
        </Link>
      </Text>
    </Stack>
  );
};

const CustomLabelDescription: FC<{
  hideLinks?: boolean;
  variant: "aws" | "gcpProjectNumber" | "gcpProjectId";
}> = ({ hideLinks, variant }) => {
  return (
    <Box mt="8px">
      {!hideLinks &&
        (variant === "aws" ? (
          <>
            <StyledListItem
              text="Don't have AWS Account?"
              link="https://signin.aws.amazon.com/signup?request_type=register"
            />

            <StyledListItem
              text="Can't find AWS Account ID?"
              link="https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html#ViewYourAWSId"
            />
          </>
        ) : variant === "gcpProjectId" ? (
          <>
            <StyledListItem
              text="Don't have GCP Account?"
              link="https://cloud.google.com/"
            />
            <StyledListItem
              text="Can't find GCP Project ID?"
              link="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects"
            />
          </>
        ) : (
          <StyledListItem
            text="Can't find GCP Project Number?"
            link="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects"
          />
        ))}
    </Box>
  );
};

export default CustomLabelDescription;
