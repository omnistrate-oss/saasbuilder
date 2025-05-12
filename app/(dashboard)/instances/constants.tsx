import AddIcon from "@mui/icons-material/Add";

import AddCapacityIcon from "components/Icons/AddCapacity/AddCapacityIcon";
import DeleteIcon from "components/Icons/Delete/Delete";
import EditIcon from "components/Icons/Edit/Edit";
import GenerateTokenIcon from "components/Icons/GenerateToken/GenerateTokenIcon";
import PlayIcon from "components/Icons/Play/Play";
import RestartIcon from "components/Icons/Reboot/Reboot";
import RemoveCapacityIcon from "components/Icons/RemoveCapacity/RemoveCapacityIcon";
import RestoreIcon from "components/Icons/RestoreInstance/RestoreInstanceIcon";
import StopIcon from "components/Icons/Stop/Stop";

export const icons = {
  Stop: StopIcon,
  Start: PlayIcon,
  Delete: DeleteIcon,
  Modify: EditIcon,
  Create: AddIcon,
  Reboot: RestartIcon,
  Restore: RestoreIcon,
  "Add Capacity": AddCapacityIcon,
  "Remove Capacity": RemoveCapacityIcon,
  "Generate Token": GenerateTokenIcon,
};

export const loadStatusMap = {
  POD_IDLE: "Low",
  POD_NORMAL: "Medium",
  POD_OVERLOAD: "High",

  LOAD_IDLE: "Low",
  LOAD_NORMAL: "Medium",
  LOAD_OVERLOADED: "High",

  STOPPED: "N/A",
  UNKNOWN: "Unknown",
  "N/A": "N/A",
};
