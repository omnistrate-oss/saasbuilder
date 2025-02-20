import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import {
  SelectedCategoryDateTimeRange,
  SelectedCategoryOptions,
} from "./AddInstanceFilters";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Close } from "@mui/icons-material";
import { themeConfig } from "src/themeConfig";
import { FilterCategorySchema, getIntialFiltersObject } from "../utils";
import { SetState } from "src/types/common/reactGenerics";
import { initialRangeState } from "src/components/DateRangePicker/DateTimeRangePickerStatic";
import { PopoverDynamicHeight } from "src/components/Popover/Popover";
dayjs.extend(utc);

const FilterChip = ({
  categoryObj,
  handleRemoveCategory,
  popoverAnchor,
  categoryToEdit,
  handleEditCategory,
}) => {
  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${themeConfig.colors.blue600}`,
        padding: "2px 8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "8px",
        background: themeConfig.colors.blue50,
        color: themeConfig.colors.blue900,
        fontSize: "12px",
        fontWeight: 500,
      }}
      onClick={(event) => handleEditCategory(event, categoryObj.name)}
      {...(categoryObj.name === categoryToEdit && {
        "aria-describedby": popoverAnchor,
      })}
    >
      {categoryObj.type === "list" && (
        <p className="whitespace-pre-wrap">
          {categoryObj.label} ={" "}
          {categoryObj.options?.map((option) => option?.label)?.join(", ")}
        </p>
      )}
      {categoryObj.type === "date-range" && (
        <p className="whitespace-pre-wrap">
          {categoryObj.label} ={" "}
          {dayjs(new Date(categoryObj.range.startDate))
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")}{" "}
          UTC to{" "}
          {dayjs(new Date(categoryObj.range.endDate))
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")}{" "}
          UTC
        </p>
      )}
      <Close
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveCategory(categoryObj.name);
        }}
        sx={{
          cursor: "pointer",
          fontSize: "14px",
        }}
      />
    </Box>
  );
};

type EditInstanceFiltersProps = {
  filterOptionsMap: Record<string, FilterCategorySchema>;
  setSelectedFilters: SetState<Record<string, FilterCategorySchema>>;
  selectedFilters: Record<string, FilterCategorySchema>;
};

const EditInstanceFilters = ({
  selectedFilters,
  setSelectedFilters,
  filterOptionsMap,
}: EditInstanceFiltersProps) => {
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "instance-filter-popover" : undefined;

  const filtersWithValues = useMemo(() => {
    return Object.keys(selectedFilters)?.filter((category) => {
      const filter = selectedFilters[category]; // Safely access the category
      if (!filter) return false; // Ensure it's defined before accessing properties

      const type = filter.type;
      if (type === "list")
        return Array.isArray(filter.options) && filter.options.length > 0;
      if (type === "date-range") return !!filter.range?.startDate;
      return false;
    });
  }, [selectedFilters]);

  const handleResetAll = () => {
    setSelectedFilters(getIntialFiltersObject());
  };

  const handleEditCategory = (event, category) => {
    setAnchorEl(event.target);
    setCategoryToEdit(category);
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedFilters((prev) => {
      const copy = _.clone(prev);
      if (copy[category].type === "list") {
        copy[category].options = [];
      } else if (copy[category].type === "date-range") {
        copy[category].range = initialRangeState;
      }
      return copy;
    });
  };

  //remove category when popver is closed
  //do not remove category in handleclose function as the transition will not be smooth
  useEffect(() => {
    if (!anchorEl) {
      setCategoryToEdit(null);
    }
  }, [anchorEl]);

  if (!filtersWithValues?.length) {
    return null;
  }

  return (
    <div className="mt-2 flex justify-start items-center gap-2 flex-wrap">
      {filtersWithValues?.map((category, i) => {
        return (
          <FilterChip
            key={i}
            categoryObj={selectedFilters[category]}
            handleRemoveCategory={handleRemoveCategory}
            popoverAnchor={id}
            categoryToEdit={categoryToEdit}
            handleEditCategory={handleEditCategory}
          />
        );
      })}
      <Box
        onClick={handleResetAll}
        sx={{
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          cursor: "pointer",
          border: `1px solid ${themeConfig.colors.blue300}`,
          color: themeConfig.colors.blue700,
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <Close
          sx={{
            fontSize: "20px",
          }}
        />
        Reset Filters
      </Box>

      <PopoverDynamicHeight
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ marginTop: "8px" }}
      >
        {categoryToEdit && (
          <div className="min-w-[470px]">
            {categoryToEdit &&
              selectedFilters[categoryToEdit].type === "list" && (
                <SelectedCategoryOptions
                  selectedCategory={filterOptionsMap[categoryToEdit]}
                  setSelectedFilters={setSelectedFilters}
                  handleRemoveCategory={handleClose}
                  initialSelection={
                    new Set(
                      selectedFilters[categoryToEdit].options?.map(
                        (option) => option.value
                      )
                    )
                  }
                />
              )}

            {categoryToEdit &&
              selectedFilters[categoryToEdit].type === "date-range" && (
                <SelectedCategoryDateTimeRange
                  setSelectedFilters={setSelectedFilters}
                  handleRemoveCategory={handleClose}
                  selectedCategory={selectedFilters[categoryToEdit]}
                />
              )}
          </div>
        )}
      </PopoverDynamicHeight>
    </div>
  );
};

export default EditInstanceFilters;
