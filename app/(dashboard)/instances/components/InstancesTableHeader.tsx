import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

import Button from "components/Button/Button";
import Select from "components/FormElementsv2/Select/Select";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "components/RefreshWithTooltip/RefreshWithToolTip";

import useSnackbar from "src/hooks/useSnackbar";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import {
  restartResourceInstance,
  startResourceInstance,
  stopResourceInstance,
} from "src/api/resourceInstance";

import { icons } from "../constants";
import { getMainResourceFromInstance } from "../utils";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "src/utils/isAllowedByRBAC";
import Tooltip from "src/components/Tooltip/Tooltip";
import { colors } from "src/themeConfig";
import AddInstanceFilters from "./AddInstanceFilters";
import EditInstanceFilters from "./EditInstanceFilters";

type Action = {
  onClick: () => void;
  isDisabled?: boolean;
  actionType?: "primary" | "secondary";
  label: string;
  disabledMessage?: string;
};

const InstancesTableHeader = ({
  count,
  selectedInstance,
  setSelectedRows,
  setOverlayType,
  setIsOverlayOpen,
  selectedInstanceOffering,
  selectedInstanceSubscription,
  refetchInstances,
  isFetchingInstances,
  filterOptionsMap,
  selectedFilters,
  setSelectedFilters,
}) => {
  const snackbar = useSnackbar();

  const stopInstanceMutation = useMutation(stopResourceInstance, {
    onSuccess: async () => {
      refetchInstances();
      setSelectedRows([]);
      snackbar.showSuccess("Stopping resource instance...");
    },
  });

  const startInstanceMutation = useMutation(startResourceInstance, {
    onSuccess: async () => {
      refetchInstances();
      setSelectedRows([]);
      snackbar.showSuccess("Starting resource instance...");
    },
  });

  const restartInstanceMutation = useMutation(restartResourceInstance, {
    onSuccess: async () => {
      refetchInstances();
      setSelectedRows([]);
      snackbar.showSuccess("Rebooting resource instance...");
    },
  });

  const selectedResource = useMemo(() => {
    return getMainResourceFromInstance(selectedInstance);
  }, [selectedInstance]);

  const isComplexResource = CLI_MANAGED_RESOURCES.includes(
    selectedResource?.resourceType as string
  );

  const isProxyResource = selectedResource?.resourceType === "PortsBasedProxy";

  const [mainActions, otherActions] = useMemo(() => {
    const actions: Action[] = [];
    const status = selectedInstance?.status;

    // Check if the user has permission to perform the operation - Role from Subscription
    const role = getEnumFromUserRoleString(
      selectedInstanceSubscription?.roleType
    );
    const isUpdateAllowedByRBAC = isOperationAllowedByRBAC(
      operationEnum.Update,
      role,
      viewEnum.Access_Resources
    );

    const isDeleteAllowedByRBAC = isOperationAllowedByRBAC(
      operationEnum.Delete,
      role,
      viewEnum.Access_Resources
    );

    const requestData = {
      serviceProviderId: selectedInstanceOffering?.serviceProviderId,
      serviceKey: selectedInstanceOffering?.serviceURLKey,
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
        isProxyResource ||
        !isUpdateAllowedByRBAC,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        stopInstanceMutation.mutate(requestData);
      },
      disabledMessage: !selectedInstance
        ? "Please select an instance"
        : status !== "RUNNING"
          ? "Instance is not running"
          : isComplexResource || isProxyResource
            ? "Operation not allowed for selected resource"
            : !isUpdateAllowedByRBAC
              ? "Operation not allowed"
              : "",
    });

    actions.push({
      label: "Start",
      actionType: "secondary",
      isDisabled:
        !selectedInstance ||
        status !== "STOPPED" ||
        isComplexResource ||
        isProxyResource ||
        !isUpdateAllowedByRBAC,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        startInstanceMutation.mutate(requestData);
      },
      disabledMessage: !selectedInstance
        ? "Please select an instance"
        : status !== "STOPPED"
          ? "Instance is not stopped"
          : isComplexResource || isProxyResource
            ? "Operation not allowed for selected resource"
            : !isUpdateAllowedByRBAC
              ? "Operation not allowed"
              : "",
    });

    actions.push({
      label: "Delete",
      actionType: "secondary",
      isDisabled:
        !selectedInstance ||
        status === "DELETING" ||
        isProxyResource ||
        !isDeleteAllowedByRBAC,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        setOverlayType("delete-dialog");
        setIsOverlayOpen(true);
      },
      disabledMessage: !selectedInstance
        ? "Please select an instance"
        : status === "DELETING"
          ? "Instance is being deleted"
          : isProxyResource
            ? "Operation not allowed for proxy resources"
            : !isDeleteAllowedByRBAC
              ? "Operation not allowed"
              : "",
    });

    actions.push({
      label: "Modify",
      actionType: "secondary",
      isDisabled:
        !selectedInstance ||
        (status !== "RUNNING" && status !== "FAILED") ||
        isComplexResource ||
        isProxyResource ||
        !isUpdateAllowedByRBAC,
      onClick: () => {
        if (!selectedInstance)
          return snackbar.showError("Please select an instance");
        setOverlayType("modify-instance-form");
        setIsOverlayOpen(true);
      },
      disabledMessage: !selectedInstance
        ? "Please select an instance"
        : status !== "RUNNING" && status !== "FAILED"
          ? "Instance is not running or failed"
          : isComplexResource || isProxyResource
            ? "Operation not allowed for selected resource"
            : !isUpdateAllowedByRBAC
              ? "Operation not allowed"
              : "",
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
          !selectedInstance ||
          (status !== "RUNNING" && status !== "FAILED") ||
          !isUpdateAllowedByRBAC,
        onClick: () => {
          if (!selectedInstance)
            return snackbar.showError("Please select an instance");
          restartInstanceMutation.mutate(requestData);
        },
        disabledMessage: !selectedInstance
          ? "Please select an instance"
          : status !== "RUNNING" && status !== "FAILED"
            ? "Instance is not running or failed"
            : !isUpdateAllowedByRBAC
              ? "Operation not allowed"
              : "",
      });

      if (selectedInstance?.isBackupEnabled) {
        other.push({
          label: "Restore",
          isDisabled:
            !selectedInstance ||
            !selectedInstance.backupStatus?.earliestRestoreTime ||
            !isUpdateAllowedByRBAC,
          onClick: () => {
            if (!selectedInstance)
              return snackbar.showError("Please select an instance");
            setOverlayType("restore-dialog");
            setIsOverlayOpen(true);
          },
          disabledMessage: !selectedInstance
            ? "Please select an instance"
            : !selectedInstance.backupStatus?.earliestRestoreTime
              ? "No restore points available"
              : !isUpdateAllowedByRBAC
                ? "Operation not allowed"
                : "",
        });
      }

      if (selectedInstance?.autoscalingEnabled) {
        other.push({
          label: "Add Capacity",
          isDisabled:
            !selectedInstance || status !== "RUNNING" || !isUpdateAllowedByRBAC,
          onClick: () => {
            if (!selectedInstance)
              return snackbar.showError("Please select an instance");
            setOverlayType("add-capacity-dialog");
            setIsOverlayOpen(true);
          },
          disabledMessage: !selectedInstance
            ? "Please select an instance"
            : status !== "RUNNING"
              ? "Instance is not running"
              : !isUpdateAllowedByRBAC
                ? "Operation not allowed"
                : "",
        });

        other.push({
          label: "Remove Capacity",
          isDisabled:
            !selectedInstance || status !== "RUNNING" || !isUpdateAllowedByRBAC,
          onClick: () => {
            if (!selectedInstance)
              return snackbar.showError("Please select an instance");
            setOverlayType("remove-capacity-dialog");
            setIsOverlayOpen(true);
          },
          disabledMessage: !selectedInstance
            ? "Please select an instance"
            : status !== "RUNNING"
              ? "Instance is not running"
              : !isUpdateAllowedByRBAC
                ? "Operation not allowed"
                : "",
        });
      }
    }

    if (selectedInstance?.kubernetesDashboardEndpoint?.dashboardEndpoint) {
      other.push({
        label: "Generate Token",
        isDisabled: false,
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
    selectedInstanceSubscription?.roleType,
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 py-4 px-6">
        <DataGridHeaderTitle
          title="List of Instances"
          desc="Details of instances"
          count={count}
          units={{ singular: "Instance", plural: "Instances" }}
        />

        <div className="flex items-center gap-4">
          <RefreshWithToolTip
            refetch={refetchInstances}
            disabled={isFetchingInstances}
          />

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
                disabledMessage={action.disabledMessage}
                outlineColor={colors.green300}
              >
                {action.label}
              </Button>
            );
          })}

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
            disabled={otherActions.length === 0}
            sx={{ margin: "0px", height: "40px" }}
          >
            {otherActions.map(
              ({ label, onClick, isDisabled, disabledMessage }) => {
                const Icon = icons[label];
                const menuItem = (
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

                if (disabledMessage) {
                  return (
                    <Tooltip
                      key={label}
                      title={disabledMessage}
                      placement="top"
                    >
                      <span>{menuItem}</span>
                    </Tooltip>
                  );
                }

                return menuItem;
              }
            )}
          </Select>
        </div>
      </div>

      <div className="px-6 py-3 border-y-[1px]">
        <AddInstanceFilters
          setSelectedFilters={setSelectedFilters}
          filterOptionsMap={filterOptionsMap}
        />

        <EditInstanceFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filterOptionsMap={filterOptionsMap}
        />
      </div>
    </div>
  );
};

export default InstancesTableHeader;
