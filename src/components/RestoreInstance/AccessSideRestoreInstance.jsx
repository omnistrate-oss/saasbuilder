import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { restoreResourceInstance } from "src/api/resourceInstance";
import useSnackbar from "src/hooks/useSnackbar";

import RestoreInstanceModal from "./RestoreInstanceModal";

function AccessSideRestoreInstance({
  open,
  handleClose,
  earliestRestoreTime,
  service,
  subscriptionId,
  selectedInstanceId,
  setSelectionModel,
  fetchResourceInstances,
  selectedResource,
  networkType,
}) {
  const [step, setStep] = useState(1);
  const [restoredInstanceID, setRestoredInstanceID] = useState(null);

  const snackbar = useSnackbar();
  const restoreMutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        targetRestoreTime: values.targetRestoreTime,
        network_type: values.network_type,
        serviceProviderId: service?.serviceProviderId,
        serviceKey: service?.serviceURLKey,
        serviceAPIVersion: service?.serviceAPIVersion,
        serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
        serviceModelKey: service?.serviceModelURLKey,
        productTierKey: service?.productTierURLKey,
        resourceKey: selectedResource?.key,
        subscriptionId,
        id: selectedInstanceId,
      };
      return restoreResourceInstance(payload);
    },
    onSuccess: (res) => {
      snackbar.showSuccess("Restore initiated successfully!");
      setSelectionModel([]);
      fetchResourceInstances(selectedResource);
      setRestoredInstanceID(res?.data?.id);
      setStep(2);
    },
  });

  return (
    <RestoreInstanceModal
      open={open}
      handleClose={handleClose}
      earliestRestoreTime={earliestRestoreTime}
      restoreMutation={restoreMutation}
      networkType={networkType}
      step={step}
      setStep={setStep}
      restoredInstanceID={restoredInstanceID}
    />
  );
}

export default AccessSideRestoreInstance;
