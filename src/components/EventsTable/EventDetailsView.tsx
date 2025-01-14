import { Box } from "@mui/material";
import JSONView from "../JSONView/JSONView";
import { OnCopyProps } from "react-json-view";

import { AuditEvent } from "src/types/auditEvent";

const EventDetailsView = (props: { rowData: AuditEvent }) => {
  const { rowData: event } = props;
  const { workflowFailures } = event;

  return (
    <Box sx={{ margin: "10px 12px" }}>
      <JSONView
        src={workflowFailures || {}}
        theme="isotope"
        enableClipboard={(copy: OnCopyProps) => {
          navigator.clipboard.writeText(JSON.stringify(copy.src));
        }}
        displayDataTypes={false}
        style={{
          flex: 1,
          padding: "16px",
          borderRadius: "12px",
          minHeight: "140px",
          maxHeight: "160px",
          overflowY: "auto",
        }}
      />
    </Box>
  );
};

export default EventDetailsView;
