import { ArrowOutward } from "@mui/icons-material";

import Button from "components/Button/Button";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";

import { getAuditLogsRoute } from "src/utils/routes";

const DashboardLogsTableHeader = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="Recent Audit Logs"
        desc="Detail audit trail of users actions performed on deployment instances"
      />

      <Button
        variant="outlined"
        href={getAuditLogsRoute()}
        target="_blank"
        endIcon={<ArrowOutward />}
      >
        View all audit logs
      </Button>
    </div>
  );
};

export default DashboardLogsTableHeader;
