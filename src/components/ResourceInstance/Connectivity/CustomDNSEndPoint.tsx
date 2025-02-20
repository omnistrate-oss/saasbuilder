import { Box, styled, SxProps, Theme } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import { Text } from "src/components/Typography/Typography";
import CopyButton from "src/components/Button/CopyButton";
import PublicResourceIcon from "src/components/Icons/PublicResource/PublicResource";
import { colors } from "src/themeConfig";

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
  return (
    <Box
      sx={{
        border: isPrimaryResource
          ? `1px solid ${colors.utilBlue200}`
          : "1px solid #EAECF0",
        background: isPrimaryResource ? colors.utilBlue50 : "white",
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
              <Text size="small" weight="medium" color={colors.utilBlue700}>
                {endpointName}
              </Text>

              <Box
                alignSelf="start"
                marginBottom="8px"
                display="flex"
                gap="12px"
                marginTop="8px"
              >
                <Text
                  size="small"
                  weight="regular"
                  color={isPrimaryResource ? colors.blue600 : ""}
                >
                  {endpointURL}
                </Text>
                <CopyButton
                  text={endpointURL}
                  iconProps={{
                    color: colors.blue600,
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
