import { Range } from "react-date-range";

import DateRangePicker from "components/DateRangePicker/DateRangePicker";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "components/RefreshWithTooltip/RefreshWithToolTip";

import { SetState } from "src/types/common/reactGenerics";
import { ServiceOffering } from "src/types/serviceOffering";
import ServiceFilter from "app/(dashboard)/notifications/components/ServiceFilter";

type AuditLogsTableHeaderProps = {
  refetchAuditLogs: () => void;
  isFetchingAuditLogs: boolean;
  selectedDateRange: Range;
  setSelectedDateRange: SetState<Range>;
  selectedServiceId: string;
  setSelectedServiceId: SetState<string>;
  serviceOfferings: ServiceOffering[];
};

const AuditLogsTableHeader: React.FC<AuditLogsTableHeaderProps> = ({
  refetchAuditLogs,
  isFetchingAuditLogs,
  selectedDateRange,
  setSelectedDateRange,
  selectedServiceId,
  setSelectedServiceId,
  serviceOfferings,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="List of Audit Logs"
        desc="Detailed audit trail of user actions performed on resource instances"
      />

      <div className="flex items-center gap-4 flex-nowrap">
        <RefreshWithToolTip
          refetch={refetchAuditLogs}
          disabled={isFetchingAuditLogs}
        />
        <DateRangePicker
          dateRange={selectedDateRange}
          setDateRange={setSelectedDateRange}
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

export default AuditLogsTableHeader;
