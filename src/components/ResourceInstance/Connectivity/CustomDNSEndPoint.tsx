import { Box, styled, SxProps, Theme } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import CopyButton from "src/components/Button/CopyButton";
import PublicResourceIcon from "src/components/Icons/PublicResource/PublicResource";
import { Text } from "src/components/Typography/Typography";
const TableCell = styled(MuiTableCell)({
  borderBottom: "none",
});
type CustomDNSEndPointProps = {
  isPrimaryResource: boolean;
  endpointURL: string;
  containerStyles?: SxProps<Theme>;
  endpointName: string;
};

const CustomDNSEndPoint: React.FC<CustomDNSEndPointProps> = ({
  isPrimaryResource,
  endpointURL,
  containerStyles,
  endpointName,
}) => {
  const endpointURLWithProtocol = endpointURL.includes("http") ? endpointURL : `https://${endpointURL}`;

  return (
    <Box
      sx={{
        border: isPrimaryResource ? "1px solid #7F56D9" : "1px solid #EAECF0",
        background: isPrimaryResource ? "#F9F5FF" : "white",
        borderRadius: "12px",
        ...containerStyles,
      }}
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              sx={{
                paddingRight: "8px",
                paddingTop: "16px",
                verticalAlign: "top",
              }}
            >
              <PublicResourceIcon />
            </TableCell>
            <TableCell
              width="100%"
              sx={{
                paddingLeft: "8px",
                paddingRight: "8px",
                marginBottom: "10px",
              }}
            >
              <Text size="small" weight="medium" color="#53389E">
                {endpointName}
              </Text>

              <Box alignSelf="start" marginBottom="8px" display="flex" gap="12px" marginTop="8px">
                <Text size="small" weight="regular" color={isPrimaryResource ? "#6941C6" : ""}>
                  <a href={`${endpointURLWithProtocol}`} target="_blank" rel="noopener noreferrer">
                    {endpointURLWithProtocol}
                  </a>
                </Text>
                <CopyButton
                  text={endpointURLWithProtocol}
                  iconProps={{
                    color: "#6941C6",
                    width: 20,
                    height: 20,
                    marginTop: 0,
                  }}
                  iconButtonProps={{ padding: "0px" }}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default CustomDNSEndPoint;
