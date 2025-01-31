import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";

const DashboardLogsTableHeader = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="Recent Events"
        desc="Detail audit trail of users actions performed on deployment instances"
      />

      <Button variant="outlined" href="/audit-logs" target="_blank">
        View all events
      </Button>
    </div>
  );
};

export default DashboardLogsTableHeader;
