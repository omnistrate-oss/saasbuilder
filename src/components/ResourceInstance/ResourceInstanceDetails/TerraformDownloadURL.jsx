import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import { getTerraformKit } from "src/api/resourceInstance";
import ExportIcon from "src/components/Icons/Export/ExportIcon";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import { Text } from "components/Typography/Typography";

const TerraformDownloadURL = ({ serviceOffering, subscriptionId, cloud_provider }) => {
  const downloadTerraformKitMutation = useMutation({
    mutationFn: () =>
      getTerraformKit(
        serviceOffering?.serviceProviderId,
        serviceOffering?.serviceURLKey,
        serviceOffering?.serviceAPIVersion,
        serviceOffering?.serviceEnvironmentURLKey,
        serviceOffering?.serviceModelURLKey,
        subscriptionId,
        cloud_provider
      ),
    onSuccess: (response) => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "terraformkit.tar");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    },
  });

  return (
    <Stack width="100%" direction="row" justifyContent="flex-end" gap="4px">
      <Text
        size="small"
        color="#7F56D9"
        sx={{ cursor: "pointer" }}
        onClick={() => downloadTerraformKitMutation.mutate()}
      >
        Download Terraform Kit
      </Text>
      <ExportIcon />
      <LoadingSpinnerSmall
        sx={{
          flexShrink: "0",
          visibility: downloadTerraformKitMutation.isPending ? "visible" : "hidden",
        }}
      />
    </Stack>
  );
};

export default TerraformDownloadURL;
