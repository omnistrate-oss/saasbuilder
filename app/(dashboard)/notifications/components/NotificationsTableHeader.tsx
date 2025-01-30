import { Range } from "react-date-range";
import DateRangePicker from "src/components/DateRangePicker/DateRangePicker";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";
import AuditLogsEventFilterDropdown from "src/components/ResourceInstance/AuditLogs/components/AuditLogsEventFilterDropdown";
import { SetState } from "src/types/common/reactGenerics";
import { EventType } from "src/types/event";
import { ServiceOffering } from "src/types/serviceOffering";
import ServiceFilter from "./ServiceFilter";

type NotificationsTableHeaderProps = {
  refetchNotifications: () => void;
  isFetchingNotifications: boolean;
  selectedDateRange: Range;
  setSelectedDateRange: SetState<Range>;
  selectedEventTypes: EventType[];
  setSelectedEventTypes: SetState<EventType[]>;
  selectedServiceId: string;
  setSelectedServiceId: SetState<string>;
  serviceOfferings: ServiceOffering[];
};

const NotificationsTableHeader: React.FC<NotificationsTableHeaderProps> = ({
  refetchNotifications,
  selectedDateRange,
  setSelectedDateRange,
  isFetchingNotifications,
  selectedEventTypes,
  setSelectedEventTypes,
  selectedServiceId,
  setSelectedServiceId,
  serviceOfferings,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="List of Notifications"
        desc="Notifications related to system activities"
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
        <AuditLogsEventFilterDropdown
          selectedEventTypes={selectedEventTypes}
          setSelectedEventTypes={setSelectedEventTypes}
          filterEventTypes={["Infra", "Maintenance"]}
        />

        <ServiceFilter
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={setSelectedServiceId}
          serviceOfferings={serviceOfferings}
        />
      </div>
    </div>
  );
};

export default NotificationsTableHeader;
