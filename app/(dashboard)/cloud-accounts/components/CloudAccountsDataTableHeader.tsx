import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import EditIcon from "src/components/Icons/Edit/Edit";

const CloudAccountsDataTableHeader = () => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="List of Cloud Account Instances"
        desc="Details of instances"
        count={1}
        units={{
          singular: "Instance",
          plural: "Instances",
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

export default CloudAccountsDataTableHeader;
