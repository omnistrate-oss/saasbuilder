import { ChevronLeft } from "@mui/icons-material";
import {
  Box,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Stack,
  styled,
} from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import SearchLens from "src/components/Icons/SearchLens/SearchLens";
import { themeConfig } from "src/themeConfig";
import Checkbox from "src/components/Checkbox/Checkbox";
import FilterFunnel from "src/components/Icons/Filter/FilterFunnel";
import { FilterCategorySchema } from "../utils";
import { SetState } from "src/types/common/reactGenerics";
import Button from "src/components/Button/Button";
import { DateTimeRangePickerStatic } from "src/components/DateRangePicker/DateTimeRangePickerStatic";
import { Range } from "react-date-range";

const StyledIconCard = styled(Box)({
  padding: "8px",
  borderRadius: "8px",
  border: `1px solid ${themeConfig.colors.gray200}`,
  boxShadow: `box-shadow: 0px 1px 2px 0px #0A0D120D, 0px -2px 0px 0px #0A0D120D inset, 0px 0px 0px 1px #0A0D122E inset`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

type SelectedCategoryDateTimeRangeProps = {
  selectedCategory: FilterCategorySchema;
  handleRemoveCategory: () => void;
  setSelectedFilters: SetState<Record<string, FilterCategorySchema>>;
};

export const SelectedCategoryDateTimeRange = ({
  selectedCategory,
  handleRemoveCategory,
  setSelectedFilters,
}: SelectedCategoryDateTimeRangeProps) => {
  const handleApplyDateRange = (value: Range) => {
    setSelectedFilters((prev) => {
      return {
        ...prev,
        [selectedCategory.name]: {
          ...selectedCategory,
          range: value,
        },
      };
    });
    handleRemoveCategory();
  };

  return (
    <DateTimeRangePickerStatic
      dateRange={selectedCategory.range as Range}
      setDateRange={handleApplyDateRange}
      handleCancel={handleRemoveCategory}
    />
  );
};

type SelectedCategoryOptionsProps = {
  // isEditView?: boolean;
  initialSelection?: Set<string>;
  selectedCategory: FilterCategorySchema;
  handleRemoveCategory: () => void;
  setSelectedFilters: SetState<Record<string, FilterCategorySchema>>;
};

export const SelectedCategoryOptions = ({
  // isEditView = false,
  initialSelection = new Set(),
  selectedCategory,
  handleRemoveCategory,
  setSelectedFilters,
}: SelectedCategoryOptionsProps) => {
  const [selectedOptionsSet, setSelectedOptionsSet] =
    useState<Set<string>>(initialSelection);

  const handleOptionToggle = (value: string) => {
    setSelectedOptionsSet((prev) => {
      const setCopy = new Set(prev);
      if (setCopy.has(value)) setCopy.delete(value);
      else setCopy.add(value);
      return setCopy;
    });
  };

  const handleCancel = () => {
    handleRemoveCategory();
  };

  const handleApply = () => {
    setSelectedFilters((prev) => {
      const newOptions: any = [];
      selectedCategory.options?.forEach((option) => {
        if (selectedOptionsSet.has(option.value)) {
          newOptions.push({ ...option });
        }
      });
      return {
        ...prev,
        [selectedCategory.name]: {
          ...selectedCategory,
          options: newOptions,
        },
      };
    });
    handleRemoveCategory();
  };

  return (
    <>
      <Stack
        direction="row"
        padding="16px"
        justifyContent="flex-start"
        alignItems="center"
        gap="12px"
        borderBottom={`1px solid ${themeConfig.colors.gray200}`}
      >
        <StyledIconCard sx={{ cursor: "pointer" }} onClick={handleCancel}>
          <ChevronLeft
            sx={{
              color: themeConfig.colors.purple600,
            }}
          />
        </StyledIconCard>
        <p className="text-lg font-semibold text-gray-900">
          Select {selectedCategory.label}
        </p>
      </Stack>

      <MenuList disablePadding sx={{ paddingBottom: "7px" }}>
        {selectedCategory?.options?.map((option, i) => (
          <MenuItem
            sx={{
              marginTop: "7px",
              padding: "9px 24px",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              color: themeConfig.colors.gray700,
            }}
            key={i}
            onClick={() => handleOptionToggle(option.value)}
          >
            <Checkbox
              //@ts-ignore
              sx={{ padding: "0px", marginRight: "8px" }}
              checked={!!selectedOptionsSet.has(option.value)}
            />{" "}
            {selectedCategory.renderOption
              ? selectedCategory.renderOption(option)
              : option.label}
          </MenuItem>
        ))}
      </MenuList>

      <Stack
        direction="row"
        padding="16px"
        justifyContent="flex-end"
        alignItems="center"
        gap="12px"
        borderTop={`1px solid ${themeConfig.colors.gray200}`}
      >
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </Stack>
    </>
  );
};

const SelectCategory = ({ filterOptionsMap, handleSelectCategory }) => {
  return (
    <>
      <Stack
        direction="row"
        padding="16px"
        justifyContent="flex-start"
        alignItems="center"
        gap="12px"
        borderBottom={`1px solid ${themeConfig.colors.gray200}`}
      >
        <StyledIconCard>
          <FilterFunnel />
        </StyledIconCard>
        <p className="text-lg font-semibold text-gray-900">Filter By</p>
      </Stack>
      <MenuList disablePadding sx={{ paddingBottom: "7px" }}>
        {Object.keys(filterOptionsMap)?.map((category, i) => (
          <MenuItem
            sx={{
              marginTop: "7px",
              padding: "9px 24px",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              color: themeConfig.colors.gray700,
            }}
            key={i}
            onClick={() => handleSelectCategory(filterOptionsMap[category])}
          >
            {filterOptionsMap[category].label}
          </MenuItem>
        ))}
      </MenuList>
    </>
  );
};

type AddInstanceFiltersProps = {
  filterOptionsMap: Record<string, FilterCategorySchema>;
  setSelectedFilters: SetState<Record<string, FilterCategorySchema>>;
};

const AddInstanceFilters = ({
  setSelectedFilters,
  filterOptionsMap,
}: AddInstanceFiltersProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategorySchema | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "instance-filter-popover" : undefined;

  const handleSelectCategory = (category: FilterCategorySchema) => {
    setSelectedCategory(category);
  };

  const handleRemoveCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <div
        tabIndex={0}
        className={`px-3 py-2 rounded-lg border-2  border-solid  ${anchorEl ? "border-purple-600" : "border-gray-300"} focus:border-purple-600 outline-none  max-w-[470px]`}
        onClick={(e) => handleOpen(e)}
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
          <Paper>
            {selectedCategory ? (
              <>
                {selectedCategory.type === "list" && (
                  <SelectedCategoryOptions
                    selectedCategory={selectedCategory}
                    handleRemoveCategory={handleRemoveCategory}
                    setSelectedFilters={setSelectedFilters}
                  />
                )}
                {selectedCategory.type === "date-range" && (
                  <SelectedCategoryDateTimeRange
                    selectedCategory={selectedCategory}
                    handleRemoveCategory={handleRemoveCategory}
                    setSelectedFilters={setSelectedFilters}
                  />
                )}
              </>
            ) : (
              <SelectCategory
                filterOptionsMap={filterOptionsMap}
                handleSelectCategory={handleSelectCategory}
              />
            )}
          </Paper>
        </div>
      </Popover>
    </>
  );
};

export default AddInstanceFilters;
