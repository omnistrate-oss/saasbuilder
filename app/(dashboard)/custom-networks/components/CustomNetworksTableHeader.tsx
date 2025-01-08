import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import EditIcon from "src/components/Icons/Edit/Edit";
import SearchInput from "src/components/DataGrid/SearchInput";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";
import useSnackbar from "src/hooks/useSnackbar";

const CustomNetworksTableHeader = ({
  searchText,
  setSearchText,
  refetchCustomNetworks,
  isFetchingCustomNetworks,
  onPeeringInfoClick,
  onDeleteClick,
  onCreateClick,
  selectedRows,
}) => {
  const snackbar = useSnackbar();

  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="List of Custom Networks"
        desc="List of configured custom networks"
        count={1}
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
          variant="outlined"
          disabled={selectedRows.length !== 1}
          onClick={() => {
            if (!selectedRows.length)
              return snackbar.showError(
                "Please select a custom network to delete"
              );
            onDeleteClick();
          }}
          startIcon={<DeleteIcon disabled={selectedRows.length !== 1} />}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          disabled={selectedRows.length !== 1}
          onClick={() => {
            if (!selectedRows.length)
              return snackbar.showError(
                "Please select a custom network to view peering info"
              );
            onPeeringInfoClick();
          }}
          startIcon={<EditIcon disabled={selectedRows.length !== 1} />}
        >
          Peering Info
        </Button>
        <Button
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
