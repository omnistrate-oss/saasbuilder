import { Box, Stack, MenuItem } from "@mui/material";

import Select from "src/components/FormElementsv2/Select/Select";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import SearchInput from "src/components/DataGrid/SearchInput";
import Button from "src/components/Button/Button";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import Tooltip from "src/components/Tooltip/Tooltip";

const SUBSCRIPTION_TYPES = {
  all: {
    label: "All Subscriptions",
    icon: null,
  },
  direct: {
    label: "Direct",
    icon: <SubscriptionTypeDirectIcon />,
  },
  invited: {
    label: "Invited",
    icon: <SubscriptionTypeInvitedIcon />,
  },
};

const DataGridHeader = ({
  numSubscriptions,
  searchText,
  setSearchText,
  typeFilter,
  setTypeFilter,
  viewResourceInstance,
  isFetching,
  handleRefresh,
  selectedSubscription,
  handleUnsubscribeClick,
  isUnsubscribing,
}) => {
  return (
    <Box borderBottom="1px solid #EAECF0" p="20px">
      <Stack
        width="100%"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap="20px"
      >
        <DataGridHeaderTitle
          title={`Detailed list of your subscriptions`}
          desc="View and manage your subscriptions"
          count={numSubscriptions}
          units={{
            singular: "Subscription",
            plural: "Subscriptions",
          }}
        />

        <Actions
          searchText={searchText}
          setSearchText={setSearchText}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          viewResourceInstance={viewResourceInstance}
          isFetching={isFetching}
          handleRefresh={handleRefresh}
          selectedSubscription={selectedSubscription}
          numSubscriptions={numSubscriptions}
          handleUnsubscribeClick={handleUnsubscribeClick}
          isUnsubscribing={isUnsubscribing}
        />
      </Stack>
    </Box>
  );
};

export default DataGridHeader;

export const Actions = (props) => {
  const {
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    isFetching,
    handleRefresh,
    selectedSubscription,
    numSubscriptions,
    handleUnsubscribeClick,
    isUnsubscribing,
  } = props;

  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      gap={"16px"}
    >
      <SearchInput
        placeholder="Search by Name"
        searchText={searchText}
        setSearchText={setSearchText}
        width="200px"
      />
      <RefreshWithToolTip refetch={handleRefresh} disabled={isFetching} />
      <Tooltip
        isVisible={Boolean(
          selectedSubscription &&
            selectedSubscription.defaultSubscription === true
        )}
        title="Cannot unsubscribe from a direct subscription"
        placement="top"
      >
        <Button
          bgColor="#D92D20"
          sx={{
            height: "40px",
            border: "8px",
            boxShadow:
              "0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px -2px 0px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 1px rgba(16, 24, 40, 0.18)",
          }}
          variant="contained"
          disabled={
            !selectedSubscription ||
            selectedSubscription?.defaultSubscription === true ||
            numSubscriptions.length === 0 ||
            isUnsubscribing ||
            isFetching ||
            selectedSubscription?.roleType !== "root"
          }
          onClick={handleUnsubscribeClick}
        >
          Unsubscribe {isUnsubscribing && <LoadingSpinnerSmall />}
        </Button>{" "}
      </Tooltip>
      <Select
        sx={{
          height: "40px !important",
          // padding: "10px 14px !important",
          margin: "0px",
          "& .MuiOutlinedInput-input": {
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "20px",
            color: "#344054",
          },
        }}
        id="type"
        name="type"
        value={typeFilter}
        onChange={(event) => {
          setTypeFilter(event.target.value);
        }}
      >
        {Object.keys(SUBSCRIPTION_TYPES).map((option) => (
          <MenuItem key={option} value={option}>
            <Stack direction={"row"} alignItems={"center"} gap="8px">
              {SUBSCRIPTION_TYPES[option]?.icon}
              {SUBSCRIPTION_TYPES[option]?.label}
            </Stack>
          </MenuItem>
        ))}
      </Select>{" "}
    </Stack>
  );
};
