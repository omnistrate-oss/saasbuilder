import { useMemo } from "react";
import { SelectChangeEvent, Typography } from "@mui/material";
import { getServiceMenuItems } from "app/(dashboard)/instances/utils";

import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";
import Select from "src/components/FormElementsv2/Select/Select";

const ServiceFilter = ({ selectedServiceId, setSelectedServiceId, serviceOfferings }) => {
  const serviceOptions = useMemo(() => getServiceMenuItems(serviceOfferings), [serviceOfferings]);

  const handleChange = (e: SelectChangeEvent) => {
    setSelectedServiceId(e.target.value);
  };
  return (
    <Select
      id={"service-options"}
      name={"service-options"}
      value={selectedServiceId}
      renderValue={() => {
        return serviceOptions?.find((option) => option.value == selectedServiceId)?.label ?? "Filter by Product Name";
      }}
      sx={{
        minWidth: "auto",
        maxWidth: "200px",
        height: "40px !important",
        marginTop: 0,
        "& .MuiSelect-select": {
          fontSize: "14px",
          color: "#414651",
          fontWeight: "500",
        },
      }}
      fullWidth={false}
      onChange={handleChange}
      displayEmpty
      MenuProps={{
        PaperProps: {
          sx: {
            maxWidth: 300, // Set dropdown max width
          },
        },
      }}
    >
      {serviceOptions?.length > 0 ? (
        [
          <MenuItem value="" key="none">
            None
          </MenuItem>,
          ...serviceOptions.map((option) => {
            const menuItem = (
              <MenuItem key={option.value as string} value={option.value as string} disabled={option.disabled}>
                <Typography variant="inherit" noWrap>
                  {option.label}
                </Typography>
              </MenuItem>
            );
            return menuItem;
          }),
        ]
      ) : (
        <MenuItem value="" disabled>
          <i>No Options</i>
        </MenuItem>
      )}
    </Select>
  );
};

export default ServiceFilter;
