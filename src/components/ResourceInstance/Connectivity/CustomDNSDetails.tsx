import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, styled } from "@mui/material";

import CopyButton from "src/components/Button/CopyButton";
import { Text } from "src/components/Typography/Typography";

type CustomDNSDetailsProps = {
  aRecordTarget?: string;
  cnameTarget?: string;
  domainName: string;
  resourceInstanceId?: string;
};

const RecordContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "24px",
  border: "1px solid #EAECF0",
  marginBottom: "24px",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
});

const RecordRowContainer = styled(Box)<{
  marginBottom?: string;
  marginTop?: string;
}>(({ marginBottom, marginTop }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  marginBottom: marginBottom ? marginBottom : "8px",
  marginTop: marginTop,
}));
const RecordColumn = styled(Box)<{ hasBorder?: boolean }>(({ hasBorder }) => ({
  display: "flex",
  alignItems: "center",
  border: hasBorder ? "1px solid #EAECF0" : "none",
  borderRadius: "8px",
  flex: 1,
  minHeight: "40px",
  backgroundColor: "#fff",
  overflow: "hidden",
  boxShadow: hasBorder ? "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" : "none",
}));

const CustomDNSDetails: React.FC<CustomDNSDetailsProps> = ({
  aRecordTarget,
  cnameTarget,
  domainName,
  resourceInstanceId,
}) => {
  const records: any[] = [];
  if (aRecordTarget) {
    records.push({
      recordLabel: "A",
      domainValue: domainName,
      recordValue: aRecordTarget,
    });
  }

  if (cnameTarget) {
    records.push({
      recordLabel: "CNAME",
      domainValue: domainName,
      recordValue: cnameTarget,
    });
  }
  records.push({
    recordLabel: "TXT",
    domainValue: domainName,
    recordValue: `target-${domainName}=${resourceInstanceId}`,
    recordValueDetails: `The TXT record is a name-value pair, where the name must start with the prefix "target-", and the value should be the Instance ID.`,
  });

  return (
    <RecordContainer>
      {records.map((record, index) => (
        <Box key={index} width="100%" marginBottom={"16px"}>
          <RecordRowContainer>
            <RecordColumn>
              <Text size="small" weight="medium" color="rgba(52, 64, 84, 1)">
                {`${record.recordLabel} Record`}
              </Text>
            </RecordColumn>

            <RecordColumn>
              <Box paddingLeft={"19px"}>
                <Text size="small" weight="medium" color="rgba(52, 64, 84, 1)">
                  Record Value
                </Text>
              </Box>
            </RecordColumn>
          </RecordRowContainer>

          <RecordRowContainer>
            <RecordColumn hasBorder>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p="10px"
                borderRight="1px solid #EAECF0"
                flexShrink={0}
                width="100px"
              >
                <Text size="medium" weight="regular" color="rgba(71, 84, 103, 1)">
                  {record.recordLabel}
                </Text>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1} minWidth={0}>
                <Box
                  p="10px"
                  borderRight="1px solid #EAECF0"
                  flexGrow={1}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  <Text size="medium" weight="regular" color="rgba(71, 84, 103, 1)" maxWidth={"100%"} ellipsis>
                    {record.domainValue}
                  </Text>
                </Box>
                <Box flexShrink={0} paddingLeft={"10px"} paddingRight={"10px"}>
                  <CopyButton text={record.domainValue} />
                </Box>
              </Box>
            </RecordColumn>

            <Box px="8px">
              <ArrowForwardIcon sx={{ color: "#6941C6" }} />
            </Box>
            <RecordColumn hasBorder>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1} minWidth={0}>
                <Box
                  p="10px"
                  borderRight="1px solid #EAECF0"
                  flexGrow={1}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  <Text size="medium" weight="regular" color="rgba(71, 84, 103, 1)" maxWidth={"100%"} ellipsis>
                    {record.recordValue}
                  </Text>
                </Box>
                <Box flexShrink={0} paddingLeft={"10px"} paddingRight={"10px"}>
                  <CopyButton text={record.recordValue} />
                </Box>
              </Box>
            </RecordColumn>
          </RecordRowContainer>
          {record?.recordValueDetails && (
            <RecordRowContainer marginTop="-4px">
              {/* @ts-ignore */}
              <RecordColumn />
              {/* @ts-ignore */}
              <Box px="8px" />
              <RecordColumn>
                <Box paddingLeft="15px">
                  <Text size="small" weight="regular" color="rgba(52, 64, 84, 1)">
                    {record?.recordValueDetails}
                  </Text>
                </Box>
              </RecordColumn>
            </RecordRowContainer>
          )}
        </Box>
      ))}
    </RecordContainer>
  );
};

export default CustomDNSDetails;
