import { Range } from "react-date-range";

import DateRangePicker from "components/DateRangePicker/DateRangePicker";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";
import RefreshWithToolTip from "components/RefreshWithTooltip/RefreshWithToolTip";

import { SetState } from "src/types/common/reactGenerics";

type AuditLogsTableHeaderProps = {
  count?: number;
  refetchAuditLogs: () => void;
  isFetchingAuditLogs: boolean;
  selectedDateRange: Range;
  setSelectedDateRange: SetState<Range>;
};

const AuditLogsTableHeader: React.FC<AuditLogsTableHeaderProps> = ({
  count,
  refetchAuditLogs,
  isFetchingAuditLogs,
  selectedDateRange,
  setSelectedDateRange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="List of Audit Logs"
        desc="Detailed audit trail of user actions performed on resource instances"
        count={count}
        units={{
          singular: "Log",
          plural: "Logs",
        }}
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
      </div>
    </div>
  );
};

export default AuditLogsTableHeader;
