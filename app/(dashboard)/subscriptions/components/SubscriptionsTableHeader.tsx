import AddIcon from "@mui/icons-material/Add";

import Button, { SecondaryColorButton } from "components/Button/Button";
import SearchInput from "components/DataGrid/SearchInput";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";

const SubscriptionsTableHeader = ({
  selectedRows,
  searchText,
  setSearchText,
  onManageSubscriptions,
  onUnsubscribe,
  isUnsubscribing,
  count,
  isFetchingSubscriptions,
  refetchSubscriptions,
  selectedSubscription,
}) => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-8">
      <DataGridHeaderTitle
        title="Detailed list of your service subscriptions"
        desc="Explore your current service subscriptions here"
        units={{
          singular: "Subscription",
          plural: "Subscriptions",
        }}
        count={count}
      />

      <div className="flex items-center gap-4 flex-shrink-0">
        <SearchInput
          placeholder="Search by Service Name"
          searchText={searchText}
          setSearchText={setSearchText}
          width="250px"
        />
        <RefreshWithToolTip
          refetch={refetchSubscriptions}
          disabled={isFetchingSubscriptions}
        />
        <SecondaryColorButton
          variant="outlined"
          onClick={onUnsubscribe}
          disabled={
            selectedRows.length !== 1 ||
            selectedSubscription?.defaultSubscription || // Cannot Unsubscribe From Default Subscription
            isUnsubscribing ||
            isFetchingSubscriptions ||
            selectedSubscription?.roleType !== "root"
          }
          disabledMessage={
            selectedRows.length !== 1
              ? "Please select a subscription to unsubscribe"
              : selectedSubscription?.defaultSubscription
                ? "Cannot unsubscribe from Default subscription"
                : selectedSubscription &&
                    selectedSubscription?.roleType !== "root"
                  ? "Cannot unsubscribe without Root access"
                  : ""
          }
        >
          Unsubscribe
        </SecondaryColorButton>
        <Button
          variant="contained"
          onClick={onManageSubscriptions}
          startIcon={<AddIcon />}
          disabled={isUnsubscribing || isFetchingSubscriptions}
          disableRipple
        >
          Manage Subscriptions
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionsTableHeader;
