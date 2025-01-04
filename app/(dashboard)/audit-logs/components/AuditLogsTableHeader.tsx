import { Range } from "react-date-range";

import DateRangePicker from "src/components/DateRangePicker/DateRangePicker";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import { SetState } from "src/types/common/reactGenerics";

type AuditLogsTableHeaderProps = {
  selectedDateRange: Range;
  setSelectedDateRange: SetState<Range>;
};

const AuditLogsTableHeader: React.FC<AuditLogsTableHeaderProps> = ({
  selectedDateRange,
  setSelectedDateRange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="List of Audit Logs"
        desc="Detailed audit trail of user actions performed on resource instances"
        units={{
          singular: "Log",
          plural: "Logs",
        }}
      />

      <DateRangePicker
        dateRange={selectedDateRange}
        setDateRange={setSelectedDateRange}
      />
    </div>
  );
};

export default AuditLogsTableHeader;
