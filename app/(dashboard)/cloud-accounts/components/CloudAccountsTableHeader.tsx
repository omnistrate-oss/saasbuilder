import AddIcon from "@mui/icons-material/Add";

import Button from "components/Button/Button";
import DeleteIcon from "components/Icons/Delete/Delete";
import SearchInput from "components/DataGrid/SearchInput";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";

const CloudAccountsTableHeader = ({
  searchText,
  setSearchText,
  onCreateClick,
  onDeleteClick,
  selectedRows,
  refetchInstances,
  isFetchingInstances,
}) => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="List of Cloud Accounts"
        desc="Details of cloud account instances"
        count={1}
        units={{
          singular: "Instance",
          plural: "Instances",
        }}
      />

      <div className="flex items-center gap-4">
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
          disabled={selectedRows.length !== 1}
          onClick={onDeleteClick}
          startIcon={<DeleteIcon disabled={selectedRows.length !== 1} />}
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
