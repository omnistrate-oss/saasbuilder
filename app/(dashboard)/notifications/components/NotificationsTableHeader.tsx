import { Range } from "react-date-range";

import DateRangePicker from "src/components/DateRangePicker/DateRangePicker";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import { SetState } from "src/types/common/reactGenerics";

type NotificationsTableHeaderProps = {
  selectedDateRange: Range;
  setSelectedDateRange: SetState<Range>;
};

const NotificationsTableHeader: React.FC<NotificationsTableHeaderProps> = ({
  selectedDateRange,
  setSelectedDateRange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="List of Notifications"
        desc="Notifications related to system activities"
        units={{
          singular: "Notification",
          plural: "Notifications",
        }}
      />

      <DateRangePicker
        dateRange={selectedDateRange}
        setDateRange={setSelectedDateRange}
      />
    </div>
  );
};

export default NotificationsTableHeader;
