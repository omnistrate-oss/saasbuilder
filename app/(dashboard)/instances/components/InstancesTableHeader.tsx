import { useMemo } from "react";
import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import EditIcon from "src/components/Icons/Edit/Edit";
import AddIcon from "@mui/icons-material/Add";
import StopIcon from "src/components/Icons/Stop/Stop";
import PlayIcon from "src/components/Icons/Play/Play";

const InstancesTableHeader = () => {
  const actions = useMemo(() => {
    const res = [];

    return res;
  }, []);

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
          variant="outlined"
          // disabled={!isCreateAllowed}
          // TODO: Check this
          onClick={() => {
            setFormMode("create");
            openCreationDrawer();
          }}
          startIcon={<StopIcon />}
        >
          Stop
        </Button>
        <Button
          variant="outlined"
          // disabled={!isCreateAllowed}
          // TODO: Check this
          onClick={() => {
            setFormMode("create");
            openCreationDrawer();
          }}
          startIcon={<PlayIcon />}
        >
          Start
        </Button>
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

export default InstancesTableHeader;
