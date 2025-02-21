import { FC } from "react";
import MuiMenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import Select from "src/components/FormElementsv2/Select/Select";
import { EventType } from "src/types/event";
import Checkbox from "src/components/Checkbox/Checkbox";
import EventTypeChip from "src/components/EventsTable/EventTypeChip";
import { SelectChangeEvent, Stack, styled } from "@mui/material";
import { SetState } from "src/types/common/reactGenerics";
import { Text } from "src/components/Typography/Typography";

const MenuItem = styled(MuiMenuItem)({
  borderRadius: 6,
  padding: "10px 14px",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "24px",
  color: "#101828",
  backgroundColor: "white",
  "&+&": {
    marginTop: "0px",
  },
  [`&.${menuItemClasses.selected}`]: {
    backgroundColor: "white",
  },
  [`&.${menuItemClasses.focusVisible}`]: {
    backgroundColor: "white",
  },
});

type DropdownProps = {
  selectedEventTypes: string[];
  setSelectedEventTypes: SetState<string[]>;
  filterEventTypes?: EventType[];
};

const AuditLogsEventFilterDropdown: FC<DropdownProps> = (props) => {
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    filterEventTypes = ["Customer", "Infra", "Maintenance"],
  } = props;

  const handleChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedEventTypes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Select
      multiple
      value={selectedEventTypes}
      renderValue={() => {
        if (selectedEventTypes.length > 0) {
          return (
            <Stack direction="row" gap="8px" alignItems="center">
              {selectedEventTypes.map((eventType: EventType, index) => {
                return <EventTypeChip key={index} eventType={eventType} />;
              })}
            </Stack>
          );
        }

        return "Filter by Type";
      }}
      sx={{
        width: "auto",
        marginTop: 0,
        minWidth: "auto",
        minHeight: "40px",
        height: "40px !important",
        borderRadius: "9999px",
        "& .MuiSelect-select": {
          fontSize: "14px",
          color: "#414651",
          fontWeight: "500",
        },
      }}
      onChange={handleChange}
      displayEmpty
      fullWidth={false}
    >
      {filterEventTypes.map((eventType) => {
        return (
          <MenuItem key={eventType} value={eventType}>
            <Checkbox
              //@ts-ignore
              sx={{ padding: "0px", marginRight: "8px" }}
              checked={selectedEventTypes.indexOf(eventType) > -1}
            />{" "}
            <EventTypeChip eventType={eventType} />
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default AuditLogsEventFilterDropdown;
