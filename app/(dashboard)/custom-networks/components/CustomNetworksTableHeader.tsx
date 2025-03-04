import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import EditIcon from "src/components/Icons/Edit/Edit";
import SearchInput from "src/components/DataGrid/SearchInput";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";
import PeeringInfoIcon from "app/(dashboard)/components/Icons/PeeringInfoIcon";

const CustomNetworksTableHeader = ({
  count,
  searchText,
  setSearchText,
  refetchCustomNetworks,
  isFetchingCustomNetworks,
  onPeeringInfoClick,
  onDeleteClick,
  onCreateClick,
  onModifyClick,
  selectedRows,
}) => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="List of Custom Networks"
        desc="List of configured custom networks"
        count={count}
        units={{
          singular: "Custom Network",
          plural: "Custom Networks",
        }}
      />

      <div className="flex items-center gap-4 flex-shrink-0">
        <SearchInput
          placeholder="Search by Name"
          searchText={searchText}
          setSearchText={setSearchText}
          width="250px"
        />
        <RefreshWithToolTip
          refetch={refetchCustomNetworks}
          disabled={isFetchingCustomNetworks}
        />
        <Button
          data-testid="modify-button"
          variant={"outlined"}
          disabled={selectedRows.length !== 1}
          onClick={onModifyClick}
          startIcon={<EditIcon disabled={selectedRows.length !== 1} />}
          disabledMessage="Please select a custom network"
        >
          Modify
        </Button>
        <Button
          data-testid="delete-button"
          variant="outlined"
          disabled={selectedRows.length !== 1}
          onClick={onDeleteClick}
          startIcon={<DeleteIcon disabled={selectedRows.length !== 1} />}
          disabledMessage="Please select a custom network"
        >
          Delete
        </Button>
        <Button
          data-testid="peering-info-button"
          variant="outlined"
          disabled={selectedRows.length !== 1}
          onClick={onPeeringInfoClick}
          startIcon={<PeeringInfoIcon disabled={selectedRows.length !== 1} />}
          disabledMessage="Please select a custom network"
        >
          Peering Info
        </Button>
        <Button
          data-testid="create-button"
          variant="contained"
          onClick={onCreateClick}
          startIcon={<AddIcon />}
          disabled={isFetchingCustomNetworks}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CustomNetworksTableHeader;
