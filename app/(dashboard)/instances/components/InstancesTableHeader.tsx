import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

import Button from "components/Button/Button";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";

import useSnackbar from "src/hooks/useSnackbar";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import {
  restartResourceInstance,
  startResourceInstance,
  stopResourceInstance,
} from "src/api/resourceInstance";
import { icons } from "../constants";
import Select from "src/components/FormElementsv2/Select/Select";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";

type Action = {
  onClick: () => void;
  isDisabled?: boolean;
  actionType?: "primary" | "secondary";
  label: string;
};

const selectedResourceId = "todo:";

const InstancesTableHeader = ({
  selectedInstance,
  setSelectedRows,
  setOverlayType,
  setIsOverlayOpen,
  selectedInstanceOffering,
}) => {
  const snackbar = useSnackbar();

  const stopInstanceMutation = useMutation(stopResourceInstance, {
    onSuccess: async () => {
      // TODO: Refetch Data
      setSelectedRows([]);
      snackbar.showSuccess("Stopping resource instance...");
    },
  });

  const startInstanceMutation = useMutation(startResourceInstance, {
    onSuccess: async () => {
      // TODO: Refetch Data
      setSelectedRows([]);
      snackbar.showSuccess("Starting resource instance...");
    },
  });

  const restartInstanceMutation = useMutation(restartResourceInstance, {
    onSuccess: async () => {
      // TODO: Refetch Data
      setSelectedRows([]);
      snackbar.showSuccess("Rebooting resource instance...");
    },
  });

  const isComplexResource = CLI_MANAGED_RESOURCES.includes(
    selectedInstance?.detailedNetworkTopology?.[selectedResourceId]
      ?.resourceType
  );

  const isProxyResource =
    selectedInstance?.detailedNetworkTopology?.[selectedResourceId]
      ?.resourceType === "PortsBasedProxy";

  const selectedResource =
    selectedInstance?.detailedNetworkTopology?.[selectedResourceId];

  const [mainActions, otherActions] = useMemo(() => {
    const actions: Action[] = [];
    const status = selectedInstance?.status;

    // TODO: Add RBAC using the Role from the Subscription

    const requestData = {
      serviceProviderId: selectedInstanceOffering?.serviceProviderId,
      serviceKey: selectedInstanceOffering?.serviceKey,
      serviceAPIVersion: selectedInstanceOffering?.serviceAPIVersion,
      serviceEnvironmentKey: selectedInstanceOffering?.serviceEnvironmentURLKey,
      serviceModelKey: selectedInstanceOffering?.serviceModelURLKey,
      productTierKey: selectedInstanceOffering?.productTierURLKey,
      resourceKey: selectedResource?.resourceKey,
      id: selectedInstance?.id,
      subscriptionId: selectedInstance?.subscriptionId,
    };

    actions.push({
      label: "Stop",
      actionType: "secondary",
      isDisabled:
        !selectedInstance ||
        status !== "RUNNING" ||
        isComplexResource ||
        isProxyResource,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        stopInstanceMutation.mutate(requestData);
      },
    });

    actions.push({
      label: "Start",
      actionType: "secondary",
      isDisabled:
        !selectedInstance ||
        status !== "STOPPED" ||
        isComplexResource ||
        isProxyResource,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        startInstanceMutation.mutate(requestData);
      },
    });

    actions.push({
      label: "Delete",
      actionType: "secondary",
      isDisabled: !selectedInstance || status === "DELETING" || isProxyResource,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        setOverlayType("delete-dialog");
        setIsOverlayOpen(true);
      },
    });

    actions.push({
      label: "Modify",
      actionType: "secondary",
      isDisabled:
        !selectedInstance ||
        (status !== "RUNNING" && status !== "FAILED") ||
        isComplexResource ||
        isProxyResource,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        setOverlayType("modify-instance-form");
        setIsOverlayOpen(true);
      },
    });

    actions.push({
      label: "Create",
      actionType: "primary",
      isDisabled: false,
      onClick: () => {
        setOverlayType("create-instance-form");
        setIsOverlayOpen(true);
      },
    });

    const other: Action[] = [];

    if (!isComplexResource && !isProxyResource) {
      other.push({
        label: "Reboot",
        isDisabled:
          !selectedInstance || (status !== "RUNNING" && status !== "FAILED"),
        onClick: () => {
          if (!selectedInstance)
            return snackbar.showError("Please select an instance");
          restartInstanceMutation.mutate(requestData);
        },
      });

      if (selectedResource?.isBackupEnabled) {
        other.push({
          label: "Restore",
          isDisabled:
            !selectedInstance ||
            !selectedInstance.backupStatus?.earliestRestoreTime,
          onClick: () => {
            if (!selectedInstance)
              return snackbar.showError("Please select an instance");
            setOverlayType("restore-dialog");
            setIsOverlayOpen(true);
          },
        });
      }

      if (selectedInstance?.autoscalingEnabled) {
        other.push({
          label: "Add Capacity",
          isDisabled: !selectedInstance || status !== "RUNNING",
          onClick: () => {
            if (!selectedInstance)
              return snackbar.showError("Please select an instance");
            setOverlayType("add-capacity-dialog");
            setIsOverlayOpen(true);
          },
        });

        other.push({
          label: "Remove Capacity",
          isDisabled: !selectedInstance || status !== "RUNNING",
          onClick: () => {
            if (!selectedInstance)
              return snackbar.showError("Please select an instance");
            setOverlayType("remove-capacity-dialog");
            setIsOverlayOpen(true);
          },
        });
      }
    }

    if (selectedInstance?.kubernetesDashboardEndpoint?.dashboardEndpoint) {
      other.push({
        label: "Generate Token",
        onClick: () => {
          if (!selectedInstance)
            return snackbar.showError("Please select an instance");
          setOverlayType("generate-token-dialog");
          setIsOverlayOpen(true);
        },
      });
    }

    return [actions, other];
  }, [
    snackbar,
    setOverlayType,
    setIsOverlayOpen,
    selectedInstance,
    stopInstanceMutation,
    startInstanceMutation,
    restartInstanceMutation,
    selectedInstanceOffering,
    isComplexResource,
    isProxyResource,
    selectedResource,
  ]);

  return (
    <div className="flex items-center justify-between gap-4 py-4 px-6">
      <DataGridHeaderTitle
        title="List of Instances"
        desc="Details of instances"
        count={0}
        units={{ singular: "Instance", plural: "Instances" }}
      />

      <div className="flex items-center gap-4">
        {mainActions.map((action, index) => {
          const Icon = icons[action.label];
          return (
            <Button
              key={index}
              variant={
                action.actionType === "primary" ? "contained" : "outlined"
              }
              disabled={action.isDisabled}
              onClick={action.onClick}
              startIcon={<Icon disabled={action.isDisabled} />}
            >
              {action.label}
            </Button>
          );
        })}

        {otherActions.length > 0 && (
          <Select
            value=""
            renderValue={(value: string) => {
              if (!value) {
                return "Action";
              } else {
                return "";
              }
            }}
            displayEmpty
            // disabled={isLoading} TODO
            sx={{ margin: "0px", height: "40px" }}
          >
            {otherActions.map(({ label, onClick, isDisabled }) => {
              const Icon = icons[label];
              return (
                <MenuItem
                  value={label}
                  key={label}
                  sx={{
                    gap: "10px",
                    fontSize: "14px",
                    color: isDisabled ? "#a3a6ac" : "",
                  }}
                  disabled={isDisabled}
                  onClick={onClick}
                >
                  <Icon disabled={isDisabled} />
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </div>
    </div>
  );
};

export default InstancesTableHeader;
