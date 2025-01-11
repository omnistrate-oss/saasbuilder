import { Range } from "react-date-range";

import DateRangePicker from "src/components/DateRangePicker/DateRangePicker";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";
import { SetState } from "src/types/common/reactGenerics";

type NotificationsTableHeaderProps = {
  count?: number;
  refetchNotifications: () => void;
  isFetchingNotifications: boolean;
  selectedDateRange: Range;
  setSelectedDateRange: SetState<Range>;
};

const NotificationsTableHeader: React.FC<NotificationsTableHeaderProps> = ({
  count,
  refetchNotifications,
  selectedDateRange,
  setSelectedDateRange,
  isFetchingNotifications,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="List of Notifications"
        desc="Notifications related to system activities"
        count={count}
        units={{
          singular: "Notification",
          plural: "Notifications",
        }}
      />

      <div className="flex items-center gap-4 flex-nowrap">
        <RefreshWithToolTip
          refetch={refetchNotifications}
          disabled={isFetchingNotifications}
        />
        <DateRangePicker
          dateRange={selectedDateRange}
          setDateRange={setSelectedDateRange}
        />
      </div>
    </div>
  );
};

export default NotificationsTableHeader;
