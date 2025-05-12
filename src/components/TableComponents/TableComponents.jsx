import { Box, Stack, styled } from "@mui/material";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import { DisplayText, Text } from "components/Typography/Typography";

export const TableContainer = styled(Box)({
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  border: "1px solid  rgba(228, 231, 236, 1)",
  backgroundColor: "white",
  borderRadius: "12px",
  padding: 20,
});

export const TableTitle = styled((props) => <DisplayText {...props} size="xsmall" />)({});

export const Table = styled(MuiTable)({ borderRadius: "12px !important" });

export const TableBody = styled(MuiTableBody)({
  borderRadius: "12px !important",
});

export const TableHead = styled(MuiTableHead)({
  backgroundColor: "rgba(249, 250, 251, 1)",
  "& .MuiTableCell-root": {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "18px",
    color: "rgba(249, 250, 251, 1)",
    borderBottom: "1px solid rgba(228, 231, 236, 1)",
    borderRadius: "12px !important",
  },
});

export const TableRow = styled(MuiTableRow)({
  borderBottom: "1px solid #EAECF0",
  borderRadius: "12px !important",
  "&:last-child": {
    borderBottom: "none",
  },
});

export const TableCell = styled(MuiTableCell)({
  padding: "16px 24px 16px 24px",
  borderBottom: "none",
  verticalAlign: "middle",
  borderRadius: "12px",
});

export const CellTitle = styled((props) => <Text size="small" weight="medium" color="#101828" {...props} />)({});

export const CellSubtext = styled((props) => <Text size="small" weight="regular" color="#475467" {...props} />)({
  mt: "2px",
});

export const CellDescription = (props) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      <Text size="small" weight="regular" color="#475467" {...props} />
    </Stack>
  );
};

export const CellDescriptionCenter = (props) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Text size="small" weight="regular" color="#475467" {...props} />
    </Stack>
  );
};

export const TableCellCenterText = styled(MuiTableCell)(() => ({
  padding: "12px 10px 12px 10px",
  borderBottom: "none",
  textAlign: "center",
}));

export const TableCell2 = styled(MuiTableCell)(() => ({
  padding: "12px 10px 12px 10px",
  borderBottom: "none",
}));
