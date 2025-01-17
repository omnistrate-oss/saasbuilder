import _ from "lodash";
import { useMemo, useState } from "react";
import Button from "src/components/Button/Button";
import CloseIcon from "src/components/Icons/Close/CloseIcon";
import { themeConfig } from "src/themeConfig";
import { format } from "date-fns";
import { MenuItem, MenuList, Popover } from "@mui/material";
import Checkbox from "src/components/Checkbox/Checkbox";
import DateRangePickerStatic from "src/components/DateRangePicker/DateRangePicketStatic";

const EditCategoryOptions = ({
  options,
  editValues,
  categoryToEdit,
  handleChangeCategoryValue,
}) => {
  if (editValues.type === "list") {
    return (
      <MenuList>
        <MenuItem
          disableRipple
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <p className="font-medium">{categoryToEdit}</p>
        </MenuItem>
        {options?.map((option, i) => (
          <MenuItem key={i} onClick={() => handleChangeCategoryValue(option)}>
            <Checkbox
              //@ts-ignore
              sx={{ padding: "0px", marginRight: "8px" }}
              checked={
                !!editValues.values.find((value) => value?.id === option?.id)
              }
            />{" "}
            {option?.name}
          </MenuItem>
        ))}
      </MenuList>
    );
  } else if (editValues.type === "date-range") {
    return (
      <DateRangePickerStatic
        dateRange={editValues.range}
        setDateRange={handleChangeCategoryValue}
      />
    );
  }

  return null;
};

const FilterChip = ({
  category,
  appliedFilters,
  handleRemoveCategory,
  popoverAnchor,
  handleEditCategory,
  categoryToEdit,
}) => {
  if (appliedFilters[category].type === "list") {
    return (
      <div
        className="rounded-2xl border border-purple-200 px-1 py-0.5 flex justify-between items-center gap-1 bg-purple-50 text-purple-700"
        onClick={(event) => handleEditCategory(event, category)}
        {...(category === categoryToEdit && {
          "aria-describedby": popoverAnchor,
        })}
      >
        <p className="whitespace-pre-wrap">
          {category} =
          {appliedFilters[category]?.values
            ?.map((value) => value?.name)
            ?.join(", ")}
        </p>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveCategory(category);
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
  } else if (appliedFilters[category].type === "date-range") {
    return (
      <div
        className="rounded-2xl border border-purple-200 px-1 py-0.5 flex justify-between items-center gap-1 bg-purple-50 text-purple-700"
        onClick={(event) => handleEditCategory(event, category)}
        {...(category === categoryToEdit && {
          "aria-describedby": popoverAnchor,
        })}
      >
        <p className="whitespace-pre-wrap">
          {category} ={" "}
          {format(appliedFilters[category].range.startDate, "MMM d, yyyy")} to{" "}
          {format(appliedFilters[category].range.endDate, "MMM d, yyyy")}
        </p>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveCategory(category);
          }}
          style={{ cursor: "pointer" }}
        >
          <CloseIcon
            width="14"
            height="14"
            color={themeConfig.colors.purple700}
            styles={{ cursor: "pointer" }}
          />
        </div>
      </div>
    );
  }
};

const EditInstanceFilters = ({
  appliedFilters,
  setAppliedFilters,
  categories,
}) => {
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [editValues, setEditValues] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
    setAppliedFilters((prev) => {
      return Object.keys(prev).reduce((acc, curr: any) => {
        if (curr === categoryToEdit) {
          if (
            appliedFilters[curr].type === "list" &&
            editValues.values.length
          ) {
            acc[curr] = editValues;
          } else if (
            appliedFilters[curr].type === "date-range" &&
            editValues.range.startDate
          ) {
            acc[curr] = editValues;
          }
        } else {
          acc[curr] = appliedFilters[curr];
        }
        return acc;
      }, {});
    });
    setEditValues({});
    setCategoryToEdit(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "instance-filter-popover" : undefined;

  const filterCategories = useMemo(() => {
    return Object.keys(appliedFilters);
  }, [appliedFilters]);

  const handleReset = () => {
    setAppliedFilters({});
  };

  const handleEditCategory = (event, category) => {
    setAnchorEl(event.target);
    setCategoryToEdit(category);
    setEditValues(appliedFilters[category]);
  };

  const handleRemoveCategory = (category) => {
    setAppliedFilters((prev) => {
      const copy = _.cloneDeep(prev);
      delete copy[category];
      return copy;
    });
  };

  const handleChangeCategoryValue = (newValue) => {
    setEditValues((prev) => {
      const copy = _.cloneDeep(prev);
      if (categoryToEdit) {
        if (copy.type === "list") {
          let categoryFilters = copy?.values;
          const existingFilter = categoryFilters?.find(
            (item: any) => item.id === newValue.id
          );
          if (existingFilter) {
            categoryFilters = categoryFilters.filter(
              (item: any) => item.id !== newValue.id
            );
          } else {
            categoryFilters.push(newValue);
          }
          copy.values = categoryFilters;
        } else if (copy.type === "date-range") {
          copy.range = newValue;
        }
      }

      return copy;
    });
  };

  if (!filterCategories?.length) {
    return null;
  }

  return (
    <div className="mt-2 flex justify-start items-center gap-2 flex-wrap">
      {filterCategories?.map((category, i) => {
        return (
          <FilterChip
            key={i}
            category={category}
            appliedFilters={appliedFilters}
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
        onClick={handleReset}
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
        {categoryToEdit && (
          <EditCategoryOptions
            options={categories[categoryToEdit]?.options}
            editValues={editValues}
            categoryToEdit={categoryToEdit}
            handleChangeCategoryValue={handleChangeCategoryValue}
          />
        )}
      </Popover>
    </div>
  );
};

export default EditInstanceFilters;
