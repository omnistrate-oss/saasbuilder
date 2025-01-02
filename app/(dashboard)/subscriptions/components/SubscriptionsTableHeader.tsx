import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";

const SubscriptionsTableHeader = () => {
  return (
    <div className="py-5 px-6 flex items justify-between gap-4">
      <DataGridHeaderTitle
        title="Detailed list of your service subscriptions"
        desc="Explore your current service subscriptions here"
        units={{
          singular: "Subscription",
          plural: "Subscriptions",
        }}
      />

      <div className="flex items-center gap-6">
        <Button variant="contained">Manage Subscriptions</Button>
      </div>
    </div>
  );
};

export default SubscriptionsTableHeader;
