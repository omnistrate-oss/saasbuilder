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
import AddInstanceFilters from "./AddInstanceFilters";
import EditInstanceFilters from "./EditInstanceFilters";
import { CircularProgress } from "@mui/material";
import InstanceFilters from "src/components/InstanceFilters/InstanceFilters";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import { colors } from "src/themeConfig";

type Action = {
  onClick: () => void;
  isLoading?: boolean;
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
  instancesFilterCount,
  statusFilters,
  setStatusFilters,
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
    return getMainResourceFromInstance(
      selectedInstance,
      selectedInstanceOffering
    );
  }, [selectedInstance, selectedInstanceOffering]);

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
      resourceKey: selectedResource?.urlKey as string,
      id: selectedInstance?.id,
      subscriptionId: selectedInstance?.subscriptionId,
    };

    actions.push({
      label: "Stop",
      actionType: "secondary",
      isLoading: stopInstanceMutation.isLoading,
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
          ? "Instance must be running to stop it"
          : isComplexResource || isProxyResource
            ? "System manages instances cannot be stopped"
            : !isUpdateAllowedByRBAC
              ? "Unauthorized to stop instances"
              : "",
    });

    actions.push({
      label: "Start",
      actionType: "secondary",
      isLoading: startInstanceMutation.isLoading,
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
          ? "Instances must be stopped before starting"
          : isComplexResource || isProxyResource
            ? "System managed instances cannot be started"
            : !isUpdateAllowedByRBAC
              ? "Unauthorized to start instances"
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
          ? "Instance deletion is already in progress"
          : isProxyResource
            ? "System managed instances cannot be deleted"
            : !isDeleteAllowedByRBAC
              ? "Unauthorized to delete instances"
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
          ? "Instance must be running or failed to modify"
          : isComplexResource || isProxyResource
            ? "System managed instances cannot be modified"
            : !isUpdateAllowedByRBAC
              ? "Unauthorized to modify instances"
              : "",
    });

    actions.push({
      label: "Create",
      actionType: "primary",
      isDisabled: false,
      onClick: () => {
        setSelectedRows([]); // To make selectedInstance becomes undefined. See page.tsx
        setOverlayType("create-instance-form");
        setIsOverlayOpen(true);
      },
    });

    const other: Action[] = [];

    if (!isComplexResource && !isProxyResource) {
      other.push({
        label: "Reboot",
        isLoading: restartInstanceMutation.isLoading,
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
            ? "Instance must be running or failed to reboot"
            : !isUpdateAllowedByRBAC
              ? "Unauthorized to reboot instances"
              : "",
      });

      if (selectedInstance?.isBackupEnabled || selectedInstance?.backupStatus) {
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
                ? "Unauthorized to restore instances"
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
              ? "Instance must be running to add capacity"
              : !isUpdateAllowedByRBAC
                ? "Unauthorized to add capacity"
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
              ? "Instance must be running to remove capacity"
              : !isUpdateAllowedByRBAC
                ? "Unauthorized to remove capacity"
                : "",
        });
      }
    }

    if (selectedInstance?.kubernetesDashboardEndpoint?.dashboardEndpoint) {
      other.push({
        label: "Generate Token",
        isDisabled: !selectedInstance,
        disabledMessage: !selectedInstance ? "Please select an instance" : "",
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
    setSelectedRows,
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
      <div className="flex items-center justify-between gap-4 py-4 px-6 border-b border-[#EAECF0]">
        <DataGridHeaderTitle
          title="List of Instances"
          desc="Details of instances"
          count={count}
          units={{ singular: "Instance", plural: "Instances" }}
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {isFetchingInstances && <CircularProgress size={20} />}
          </div>

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
                disabled={action.isDisabled || action.isLoading}
                onClick={action.onClick}
                startIcon={
                  <Icon disabled={action.isDisabled || action.isLoading} />
                }
                disabledMessage={action.disabledMessage}
              >
                {action.label}
                {action.isLoading && <LoadingSpinnerSmall />}
              </Button>
            );
          })}

          <Select
            value=""
            renderValue={(value: string) => {
              if (!value) {
                return "Actions";
              } else {
                return "";
              }
            }}
            displayEmpty
            disabled={otherActions.length === 0}
            MenuProps={{
              anchorOrigin: { vertical: "bottom", horizontal: "right" },
              transformOrigin: { vertical: "top", horizontal: "right" },
            }}
            sx={{ margin: "0px", height: "40px", minWidth: "110px" }}
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
                      color: isDisabled ? colors.gray400 : "",
                      minWidth: "240px",
                      padding: "8px 16px",
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

      <div className="px-6 py-4 border-b-[1px]">
        <AddInstanceFilters
          setSelectedFilters={setSelectedFilters}
          filterOptionsMap={filterOptionsMap}
          selectedFilters={selectedFilters}
        />

        <EditInstanceFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filterOptionsMap={filterOptionsMap}
        />
      </div>
      <div className="flex flex-row justify-between gap-4 items-center py-4 px-6 border-b border-[#EAECF0]">
        <InstanceFilters
          filterStatus={statusFilters}
          setFilterStatus={setStatusFilters}
          filterInstanceCount={instancesFilterCount}
        />
      </div>
    </div>
  );
};

export default InstancesTableHeader;
