import Image from "next/image";

import { Box, Stack } from "@mui/material";

import { Text } from "../Typography/Typography";

const AlertIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 9.00023V13.0002M11.9998 17.0002H12.0098M10.6151 3.89195L2.39019 18.0986C1.93398 18.8866 1.70588 19.2806 1.73959 19.6039C1.769 19.886 1.91677 20.1423 2.14613 20.309C2.40908 20.5002 2.86435 20.5002 3.77487 20.5002H20.2246C21.1352 20.5002 21.5904 20.5002 21.8534 20.309C22.0827 20.1423 22.2305 19.886 22.2599 19.6039C22.2936 19.2806 22.0655 18.8866 21.6093 18.0986L13.3844 3.89195C12.9299 3.10679 12.7026 2.71421 12.4061 2.58235C12.1474 2.46734 11.8521 2.46734 11.5935 2.58235C11.2969 2.71421 11.0696 3.10679 10.6151 3.89195Z"
        stroke="#DC6803"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const DataUnavailableMessage = ({ title, description }) => {
  return (
    <Stack alignItems="center" mt="64px">
      <Box
        display="flex"
        alignItems="center"
        gap="12px"
        borderRadius="12px"
        border="1px solid #E9EAEB"
        boxShadow="0px 1px 2px 0px #0A0D120D"
        p="20px"
      >
        <Box
          width="48px"
          height="48px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
          border="1px solid #E9EAEB"
          boxShadow="0px 1px 2px 0px #0A0D120D, 0px -2px 0px 0px #0A0D120D inset, 0px 0px 0px 1px #0A0D122E inset"
        >
          <AlertIcon />
        </Box>

        <Box>
          <Text size="medium" weight="semibold" color="#414651">
            {title}
          </Text>
          <Text
            size="small"
            weight="regular"
            color="#535862"
            sx={{ mt: "2px" }}
          >
            {description}
          </Text>
        </Box>
      </Box>

      <Image
        src="/assets/instance-details/gears.svg"
        alt="Gears"
        width={172}
        height={147}
        style={{ marginTop: "24px" }}
      />
    </Stack>
  );
};

export default DataUnavailableMessage;
