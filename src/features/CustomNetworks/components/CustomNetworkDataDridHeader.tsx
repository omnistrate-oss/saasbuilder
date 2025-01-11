import { Box, IconButton, Stack } from "@mui/material";
import { FC } from "react";
import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import Add from "@mui/icons-material/Add";
import { FormMode } from "src/types/common/enums";
import RefreshIcon from "src/components/Icons/Refresh/Refresh";
import { QueryObserverResult } from "@tanstack/react-query";
import { CustomNetwork } from "src/types/customNetwork";
import SearchInput from "src/components/DataGrid/SearchInput";
import { SetState } from "src/types/common/reactGenerics";

type CustomNetworkDataGridHeaderProps = {
  count: number;
  searchText: string;
  setSearchText: SetState<string>;
  openDialog: () => void;
  openSideDrawer: (drawerType: FormMode) => void;
  refetchCustomNetworks: () => Promise<
    QueryObserverResult<CustomNetwork[], unknown>
  >;
  isFetchingCustomNetworks: boolean;
  isPeeringInfoEnabled: boolean;
};

const PeeringInfoIcon = ({ disabled }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8333 7.50001C15.8333 10.7217 13.2217 13.3333 10 13.3333M15.8333 7.50001C15.8333 4.27834 13.2217 1.66667 10 1.66667M15.8333 7.50001H4.16667M10 13.3333C6.77834 13.3333 4.16667 10.7217 4.16667 7.50001M10 13.3333C11.4591 11.736 12.289 9.66299 12.3341 7.50001C12.289 5.33703 11.4591 3.26404 10 1.66667M10 13.3333C8.54092 11.736 7.71249 9.66299 7.66743 7.50001C7.71249 5.33703 8.54092 3.26404 10 1.66667M10 13.3333V15M4.16667 7.50001C4.16667 4.27834 6.77834 1.66667 10 1.66667M11.6667 16.6667C11.6667 17.5871 10.9205 18.3333 10 18.3333C9.07953 18.3333 8.33333 17.5871 8.33333 16.6667M11.6667 16.6667C11.6667 15.7462 10.9205 15 10 15M11.6667 16.6667H17.5M8.33333 16.6667C8.33333 15.7462 9.07953 15 10 15M8.33333 16.6667H2.5"
        stroke={disabled ? "#a3a6ac" : "#7F56D9"}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.2s ease-in-out" }}
      />
    </svg>
  );
};

const CustomNetworkDataGridHeader: FC<CustomNetworkDataGridHeaderProps> = (
  props
) => {
  const {
    count,
    searchText,
    setSearchText,
    openDialog,
    openSideDrawer,
    refetchCustomNetworks,
    isFetchingCustomNetworks,
    isPeeringInfoEnabled,
  } = props;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="12px"
      p="20px"
      borderBottom="1px solid #EAECF0"
      justifyContent="space-between"
    >
      <DataGridHeaderTitle
        title="List of Custom Networks"
        desc="List of configured custom networks"
        count={count}
        units={{
          singular: "Custom Network",
          plural: "Custom Networks",
        }}
      />
      <Stack direction="row" gap="8px">
        <SearchInput
          placeholder="Search by Network ID"
          searchText={searchText}
          setSearchText={setSearchText}
          width="250px"
        />
        <IconButton
          size="small"
          disabled={isFetchingCustomNetworks}
          onClick={refetchCustomNetworks}
        >
          <RefreshIcon disabled={isFetchingCustomNetworks} />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<PeeringInfoIcon disabled={!isPeeringInfoEnabled} />}
          onClick={openDialog}
          disabled={!isPeeringInfoEnabled}
        >
          Peering Info
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => openSideDrawer("create")}
        >
          Create Custom Network
        </Button>
      </Stack>
    </Box>
  );
};

export default CustomNetworkDataGridHeader;
