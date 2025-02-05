import AddIcon from "@mui/icons-material/Add";

import Button from "components/Button/Button";
import DeleteIcon from "components/Icons/Delete/Delete";
import SearchInput from "components/DataGrid/SearchInput";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "components/RefreshWithTooltip/RefreshWithToolTip";

import { CircularProgress } from "@mui/material";

const CloudAccountsTableHeader = ({
  count,
  searchText,
  setSearchText,
  onCreateClick,
  onDeleteClick,
  selectedInstance,
  refetchInstances,
  isFetchingInstances,
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
