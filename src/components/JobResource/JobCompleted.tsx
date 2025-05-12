import { Box, Stack } from "@mui/material";
import BrokenCircleCheckIcon from "app/(dashboard)/components/Icons/BrokenCircleCheckIcon";

import JobResourceIcon from "src/components/Icons/JobResource/JobResourceIcon";

import Card from "../Card/Card";
import { Text } from "../Typography/Typography";

function JobCompleted() {
  return (
    <Stack flexDirection={"column"} gap="24px" alignItems="center" sx={{ marginTop: "64px", marginBottom: "200px" }}>
      <Card display={"flex"} flexDirection={"row"} alignItems={"center"} gap="12px" padding={"20px !important"}>
        <Box
          sx={{
            border: "1px solid #E9EAEB",
            boxShadow: "0px 1px 2px 0px #0A0D120D,0px -2px 0px 0px #0A0D120D inset,0px 0px 0px 1px #0A0D120D inset",
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BrokenCircleCheckIcon color="#17B26A" />
        </Box>

        <Text size="xlarge" weight="bold" color="#6941C6">
          Job execution completed successfully
        </Text>
      </Card>
      <JobResourceIcon />
    </Stack>
  );
}

export default JobCompleted;
