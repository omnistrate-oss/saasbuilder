import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import Button from "src/components/Button/Button";
import CloseIcon from "src/components/Icons/Close/CloseIcon";
import { themeConfig } from "src/themeConfig";
import { format } from "date-fns";
import { Paper, Popover } from "@mui/material";
import {
  SelectedCategoryDateTimeRange,
  SelectedCategoryOptions,
} from "./AddInstanceFilters";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const FilterChip = ({
  categoryObj,
  handleRemoveCategory,
  popoverAnchor,
  categoryToEdit,
  handleEditCategory,
}) => {
  return (
    <div
      className="rounded-2xl border border-purple-200 px-1 py-0.5 flex justify-between items-center gap-1 bg-purple-50 text-purple-700"
      onClick={(event) => handleEditCategory(event, categoryObj.name)}
      {...(categoryObj.name === categoryToEdit && {
        "aria-describedby": popoverAnchor,
      })}
    >
      {categoryObj.type === "list" && (
        <p className="whitespace-pre-wrap">
          {categoryObj.label} ={" "}
          {categoryObj.options?.map((option) => option?.value)?.join(", ")}
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
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveCategory(categoryObj.name);
        }}
        style={{ cursor: "pointer" }}
      >
        <CloseIcon
          width="14"
          height="14"
          color={themeConfig.colors.purple700}
        />
      </div>
    </div>
  );
};

const EditInstanceFilters = ({
  selectedFilters,
  setSelectedFilters,
  filterOptionsMap,
}) => {
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "instance-filter-popover" : undefined;

  const filtersWithValues = useMemo(() => {
    return Object.keys(selectedFilters)?.filter((category) => {
      const type = selectedFilters[category].type;
      if (type === "list") return selectedFilters[category].options.length > 0;
      if (type === "date-range")
        return !!selectedFilters[category].range.startDate;
      return false;
    });
  }, [selectedFilters]);

  const handleResetAll = () => {
    setSelectedFilters({});
  };

  const handleEditCategory = (event, category) => {
    setAnchorEl(event.target);
    setCategoryToEdit(category);
  };

  const handleRemoveCategory = (category) => {
    setSelectedFilters((prev) => {
      const copy = _.clone(prev);
      delete copy[category];
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
      <Button
        variant="outlined"
        startIcon={<CloseIcon />}
        onClick={handleResetAll}
      >
        Reset
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="min-w-[470px]">
          <Paper>
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
          </Paper>
        </div>
      </Popover>
    </div>
  );
};

export default EditInstanceFilters;
