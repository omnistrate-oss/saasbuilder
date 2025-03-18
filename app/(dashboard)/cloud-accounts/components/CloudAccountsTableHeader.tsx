import AddIcon from "@mui/icons-material/Add";

import Button from "components/Button/Button";
import DeleteIcon from "components/Icons/Delete/Delete";
import SearchInput from "components/DataGrid/SearchInput";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "components/RefreshWithTooltip/RefreshWithToolTip";

import { CircularProgress } from "@mui/material";
import ConnectIcon from "src/components/Icons/Connect/Connect";
import DisconnectIcon from "src/components/Icons/Disconnect/Disconnect";

const CloudAccountsTableHeader = ({
  count,
  searchText,
  setSearchText,
  onCreateClick,
  onDeleteClick,
  selectedInstance,
  refetchInstances,
  isFetchingInstances,
  onConnectClick,
  onDisconnectClick,
}) => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="List of Cloud Accounts"
        desc="Details of cloud account instances"
        count={count}
        units={{
          singular: "Account",
          plural: "Accounts",
        }}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center mr-6">
          {isFetchingInstances && <CircularProgress size={20} />}
        </div>

        <SearchInput
          placeholder="Search by ID"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <RefreshWithToolTip
          refetch={refetchInstances}
          disabled={isFetchingInstances}
        />

        <Button
          data-testid="delete-button"
          variant="outlined"
          disabled={!selectedInstance || selectedInstance.status === "DELETING"}
          onClick={onDeleteClick}
          startIcon={
            <DeleteIcon
              disabled={
                !selectedInstance || selectedInstance.status === "DELETING"
              }
            />
          }
          disabledMessage={
            !selectedInstance
              ? "Please select a cloud account"
              : selectedInstance.status === "DELETING"
                ? "Cloud account deletion is already in progress"
                : ""
          }
        >
          Delete
        </Button>
        <Button
          data-testid="disconnect-button"
          variant="outlined"
          disabled={
            !selectedInstance ||
            selectedInstance?.status === "CONNECTING" ||
            selectedInstance.status === "ATTACHING" ||
            selectedInstance.status === "CONNECTING" ||
            selectedInstance.status === "DISCONNECTED" ||
            selectedInstance?.result_params?.cloud_provider === "gcp"
          }
          onClick={onDisconnectClick}
          startIcon={
            <DisconnectIcon
              disabled={
                !selectedInstance ||
                selectedInstance?.status === "CONNECTING" ||
                selectedInstance.status === "ATTACHING" ||
                selectedInstance.status === "CONNECTING" ||
                selectedInstance.status === "DISCONNECTED" ||
                selectedInstance?.result_params?.cloud_provider === "gcp"
              }
            />
          }
          disabledMessage={
            !selectedInstance
              ? "Please select a cloud account"
              : selectedInstance.status === "DISCONNECTING" ||
                  selectedInstance.status === "DISCONNECTED"
                ? "Cloud account deletion is already in progress"
                : ""
          }
        >
          Disconnect
        </Button>
        <Button
          data-testid="connect-button"
          variant="outlined"
          disabled={
            !selectedInstance ||
            selectedInstance?.status === "READY" ||
            selectedInstance?.status === "DISCONNECTING" ||
            selectedInstance?.status === "DETACHING" ||
            selectedInstance?.result_params?.cloud_provider === "gcp"
          }
          onClick={onConnectClick}
          startIcon={
            <ConnectIcon
              disabled={
                !selectedInstance ||
                selectedInstance?.status === "READY" ||
                selectedInstance?.status === "DISCONNECTING" ||
                selectedInstance?.status === "DETACHING" ||
                selectedInstance?.result_params?.cloud_provider === "gcp"
              }
            />
          }
          disabledMessage={
            !selectedInstance
              ? "Please select a cloud account"
              : selectedInstance.status === "CONNECT"
                ? "Cloud account deletion is already in progress"
                : ""
          }
        >
          Connect
        </Button>
        <Button
          data-testid="create-button"
          variant="contained"
          onClick={onCreateClick}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CloudAccountsTableHeader;
