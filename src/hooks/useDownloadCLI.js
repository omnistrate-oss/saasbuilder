import { useMutation } from "@tanstack/react-query";

import { downloadCLI } from "../api/service-api";
import { saveBlob } from "../utils/saveBlob";

function useDownloadCLI() {
  const downloadCLIMutation = useMutation({
    mutationFn: (data) => {
      const response = downloadCLI(data.serviceId, data.serviceApiId, data.subscriptionId);
      const blob = response.data;
      saveBlob(blob, "cli");
    },
  });

  return {
    downloadCLI: (serviceId, serviceApiId, subscriptionId) => {
      downloadCLIMutation.mutate({
        serviceId,
        serviceApiId,
        subscriptionId,
      });
    },
    isDownloading: downloadCLIMutation.isPending,
  };
}

export default useDownloadCLI;
