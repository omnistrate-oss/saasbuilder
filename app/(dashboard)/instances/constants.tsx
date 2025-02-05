import AddIcon from "@mui/icons-material/Add";
import PlayIcon from "components/Icons/Play/Play";
import EditIcon from "components/Icons/Edit/Edit";
import StopIcon from "components/Icons/Stop/Stop";
import DeleteIcon from "components/Icons/Delete/Delete";
import RestartIcon from "components/Icons/Reboot/Reboot";
import RestoreIcon from "components/Icons/RestoreInstance/RestoreInstanceIcon";
import AddCapacityIcon from "components/Icons/AddCapacity/AddCapacityIcon";
import GenerateTokenIcon from "components/Icons/GenerateToken/GenerateTokenIcon";
import RemoveCapacityIcon from "components/Icons/RemoveCapacity/RemoveCapacityIcon";

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
  UNKNOWN: "Unknown",
};
