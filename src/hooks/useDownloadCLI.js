import { useMutation } from "@tanstack/react-query";

import { downloadCLI } from "../api/service-api";
import { saveBlob } from "../utils/saveBlob";

function useDownloadCLI() {
  const downloadCLIMutation = useMutation(
    (data) => {
      return downloadCLI(data.serviceId, data.serviceApiId, data.subscriptionId);
    },
    {
      onSuccess: (response) => {
        const blob = response.data;
        saveBlob(blob, "cli");
      },
      onError: (error) => {
        console.error("Error", error?.response?.data);
      },
    }
  );

  return {
    downloadCLI: (serviceId, serviceApiId, subscriptionId) => {
      downloadCLIMutation.mutate({
        serviceId,
        serviceApiId,
        subscriptionId,
      });
    },
    isDownloading: downloadCLIMutation.isLoading,
  };
}

export default useDownloadCLI;
