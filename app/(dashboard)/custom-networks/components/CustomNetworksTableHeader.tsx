import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import EditIcon from "src/components/Icons/Edit/Edit";

const CustomNetworksTableHeader = () => {
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

      <div className="flex items-center gap-4">
        <Button
          variant="outlined"
          // disabled={!isCreateAllowed}
          // TODO: Check this
          onClick={() => {
            setFormMode("create");
            openCreationDrawer();
          }}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          // disabled={!isCreateAllowed}
          // TODO: Check this
          onClick={() => {
            setFormMode("create");
            openCreationDrawer();
          }}
          startIcon={<EditIcon />}
        >
          Modify
        </Button>
        <Button
          variant="outlined"
          // disabled={!isCreateAllowed}
          // TODO: Check this
          onClick={() => {
            setFormMode("create");
            openCreationDrawer();
          }}
          startIcon={<EditIcon />}
        >
          Peering Info
        </Button>
        <Button
          variant="contained"
          //   disabled={!isCreateAllowed}
          // TODO: Check this
          onClick={() => {
            setFormMode("create");
            openCreationDrawer();
          }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CustomNetworksTableHeader;
