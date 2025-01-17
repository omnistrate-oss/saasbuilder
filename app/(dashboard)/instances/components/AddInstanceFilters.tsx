import { ChevronLeft } from "@mui/icons-material";
import { MenuItem, MenuList, Popover } from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import SearchLens from "src/components/Icons/SearchLens/SearchLens";
import { themeConfig } from "src/themeConfig";
import Checkbox from "src/components/Checkbox/Checkbox";
import { initialRangeState } from "src/components/DateRangePicker/DateRangePicker";
import { Range } from "react-date-range";
import DateRangePickerStatic from "src/components/DateRangePicker/DateRangePicketStatic";

const SelectedCategoryOptions = ({
  options,
  SelectedCategoryFilters,
  category,
  handleChangeCategoryValue,
  handleRemoveCategory,
}) => {
  if (SelectedCategoryFilters.type === "list") {
    return (
      <MenuList>
        <MenuItem
          onClick={handleRemoveCategory}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <ChevronLeft />

          <p className="font-medium">{category}</p>
        </MenuItem>
        {options?.map((option, i) => (
          <MenuItem key={i} onClick={() => handleChangeCategoryValue(option)}>
            <Checkbox
              //@ts-ignore
              sx={{ padding: "0px", marginRight: "8px" }}
              checked={
                !!SelectedCategoryFilters.values.find(
                  (value) => value?.id === option?.id
                )
              }
            />{" "}
            {option?.name}
          </MenuItem>
        ))}
      </MenuList>
    );
  } else if (SelectedCategoryFilters.type === "date-range") {
    return (
      <DateRangePickerStatic
        dateRange={SelectedCategoryFilters.range}
        setDateRange={handleChangeCategoryValue}
      />
    );
  }

  return null;
};

type ListOptionsSchema = Record<
  "services" | "servicePlans" | "resources",
  {
    values: any[];
    type: "list";
  }
>;

type DateRangeSchema = Record<
  "createdOn",
  {
    range: Range;
    type: "date-range";
  }
>;

type SelectedFilters = DateRangeSchema | ListOptionsSchema;

const initialFilterObject: SelectedFilters = {
  services: { values: [], type: "list" },
  servicePlans: { values: [], type: "list" },
  resources: { values: [], type: "list" },
  createdOn: { range: initialRangeState, type: "date-range" },
};

const AddInstanceFilters = ({ setAppliedFilters, categories }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(initialFilterObject);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAppliedFilters(
      Object.keys(selectedFilters).reduce((acc, curr) => {
        if (
          selectedFilters[curr].type === "list" &&
          selectedFilters[curr].values.length
        ) {
          acc[curr] = _.cloneDeep(selectedFilters[curr]);
        } else if (
          selectedFilters[curr].type === "date-range" &&
          selectedFilters[curr].range.startDate
        ) {
          acc[curr] = selectedFilters[curr];
        }
        return acc;
      }, {})
    );
    setAnchorEl(null);
    setSelectedCategory(null);
    setSelectedFilters(initialFilterObject);
  };

  const open = Boolean(anchorEl);
  const id = open ? "instance-filter-popover" : undefined;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleRemoveCategory = () => {
    setSelectedCategory(null);
  };

  const handleChangeCategoryValue = (newValue: any) => {
    setSelectedFilters((prev) => {
      const copy = _.cloneDeep(prev);
      if (selectedCategory) {
        if (copy[selectedCategory].type === "list") {
          let categoryFilters = copy[selectedCategory]?.values;
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
          copy[selectedCategory].values = categoryFilters;
        } else if (copy[selectedCategory].type === "date-range") {
          copy[selectedCategory].range = newValue;
          handleRemoveCategory();
        }
      }

      return copy;
    });
  };

  return (
    <>
      <div
        tabIndex={0}
        className={`px-3 py-2 rounded-lg border-2  border-solid  ${anchorEl ? "border-purple-600" : "border-gray-300"} focus:border-purple-600 outline-none  max-w-[470px]`}
        onClick={handleOpen}
        aria-describedby={id}
      >
        <div className="flex justify-start items-center gap-2">
          <SearchLens color={themeConfig.colors.gray500} />
          <p className="text-base font-normal font-gray-500">Add Filter</p>
        </div>
      </div>

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
          {selectedCategory ? (
            <SelectedCategoryOptions
              options={categories[selectedCategory]?.options}
              SelectedCategoryFilters={selectedFilters[selectedCategory]}
              category={selectedCategory}
              handleRemoveCategory={handleRemoveCategory}
              handleChangeCategoryValue={handleChangeCategoryValue}
            />
          ) : (
            <MenuList>
              {Object.keys(categories)?.map((category, i) => (
                <MenuItem
                  key={i}
                  onClick={() => handleCategorySelect(category)}
                >
                  {categories[category].label}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </div>
      </Popover>
    </>
  );
};

export default AddInstanceFilters;
