import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";

const SubscriptionsTableHeader = ({
  selectedRows,
  refetchSubscriptions,
  subscriptions,
  searchText,
  setSearchText,
  onManageSubscriptions,
}) => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="Detailed list of your service subscriptions"
        desc="Explore your current service subscriptions here"
        units={{
          singular: "Subscription",
          plural: "Subscriptions",
        }}
        count={subscriptions?.length}
      />

      <div className="flex items-center gap-6">
        <Button
          bgColor="#E2584D"
          variant="contained"
          disabled={selectedRows.length !== 1}
        >
          Unsubscribe
        </Button>
        <Button variant="contained" onClick={onManageSubscriptions}>
          Manage Subscriptions
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionsTableHeader;
