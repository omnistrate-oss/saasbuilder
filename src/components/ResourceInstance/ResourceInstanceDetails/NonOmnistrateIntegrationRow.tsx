import Link from "next/link";
import { Stack } from "@mui/material";

import CopyButton from "src/components/Button/CopyButton";
// import { PROVIDER_LOGO_ICON_MAP } from "src/constants/productTierFeatures";

type NonOmnistrateIntegrationRowProps = {
  integration: {
    enabled: boolean;
    featureName: string;
    scope: string;
    provider: string;
    Url?: string;
    healthStatus: "HEALTHY" | "UNHEALTHY" | "UNKNOWN" | "STOPPED";
    message?: string;
  };
};

function NonOmnistrateIntegrationRow({
  integration,
}: NonOmnistrateIntegrationRowProps) {
  const { Url } = integration;
  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap="6px"
    >
      {/* {PROVIDER_LOGO_ICON_MAP[provider]} */}
      <Link
        style={{
          fontSize: "18px",
          lineHeight: "28px",
          fontWeight: 600,
          color: "#7F56D9",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        href={Url}
        target="_blank"
      >
        {Url}
      </Link>
      <CopyButton text={Url} />
    </Stack>
  );
}

export default NonOmnistrateIntegrationRow;
