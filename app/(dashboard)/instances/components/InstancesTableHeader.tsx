import { useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from "@tanstack/react-query";

import Button from "components/Button/Button";
import PlayIcon from "components/Icons/Play/Play";
import EditIcon from "components/Icons/Edit/Edit";
import StopIcon from "components/Icons/Stop/Stop";
import DeleteIcon from "components/Icons/Delete/Delete";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";

import useSnackbar from "src/hooks/useSnackbar";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import {
  restartResourceInstance,
  startResourceInstance,
  stopResourceInstance,
} from "src/api/resourceInstance";

type Action = {
  onClick: () => void;
  isDisabled?: boolean;
  actionType: "primary" | "secondary";
  label: string;
};

const InstancesTableHeader = ({
  selectedInstance,
  setSelectedRows,
  setOverlayType,
  setIsOverlayOpen,
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

  const headerActions = useMemo(() => {
    const actions: Action[] = [];
    const status = selectedInstance?.status;
    const selectedResourceId = "todo:";

    const isComplexResource = CLI_MANAGED_RESOURCES.includes(
      selectedInstance?.detailedNetworkTopology?.[selectedResourceId]
        ?.resourceType
    );

    const isProxyResource =
      selectedInstance?.detailedNetworkTopology?.[selectedResourceId]
        ?.resourceType === "PortsBasedProxy";

    // TODO: Add RBAC using the Role from the Subscription

    actions.push({
      label: "Stop",
      actionType: "secondary",
      isDisabled: status !== " RUNNING" || isComplexResource || isProxyResource,
      onClick: () => {
        stopInstanceMutation.mutate(updateformik.values);
      },
    });

    actions.push({
      label: "Start",
      actionType: "secondary",
      isDisabled: status !== "STOPPED" || isComplexResource || isProxyResource,
      onClick: () => {
        startInstanceMutation.mutate(updateformik.values);
      },
    });

    actions.push({
      label: "Delete",
      actionType: "secondary",
      isDisabled: status === "DELETING" || isProxyResource,
      onClick: () => {
        setOverlayType("delete-dialog");
        setIsOverlayOpen(true);
      },
    });

    actions.push({
      label: "Modify",
      actionType: "secondary",
      isDisabled:
        (status !== "RUNNING" && status !== "FAILED") ||
        isComplexResource ||
        isProxyResource,
      onClick: () => {
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

    return actions;
  }, [
    selectedInstance,
    stopInstanceMutation,
    startInstanceMutation,
    setOverlayType,
    setIsOverlayOpen,
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
        <Button
          variant={
            headerActions[0].actionType === "primary" ? "contained" : "outlined"
          }
          disabled={headerActions[0].isDisabled}
          onClick={headerActions[0].onClick}
          startIcon={<StopIcon />}
        >
          Stop
        </Button>
        <Button
          variant={
            headerActions[1].actionType === "primary" ? "contained" : "outlined"
          }
          disabled={headerActions[1].isDisabled}
          onClick={headerActions[1].onClick}
          startIcon={<PlayIcon />}
        >
          Start
        </Button>
        <Button
          variant={
            headerActions[2].actionType === "primary" ? "contained" : "outlined"
          }
          disabled={headerActions[2].isDisabled}
          onClick={headerActions[2].onClick}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button
          variant={
            headerActions[3].actionType === "primary" ? "contained" : "outlined"
          }
          disabled={headerActions[3].isDisabled}
          onClick={headerActions[3].onClick}
          startIcon={<EditIcon />}
        >
          Modify
        </Button>
        <Button
          variant={
            headerActions[4].actionType === "primary" ? "contained" : "outlined"
          }
          disabled={headerActions[4].isDisabled}
          onClick={headerActions[4].onClick}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default InstancesTableHeader;
