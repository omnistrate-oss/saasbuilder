import { Box, BoxProps, Stack } from "@mui/material";
import { FC, useState } from "react";
import Link from "next/link";
import { Text } from "src/components/Typography/Typography";
import CopyButton from "src/components/Button/CopyButton";
import StatusChip from "src/components/StatusChip/StatusChip";
import { getResourceInstanceDetailsStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceDetailsStatus";
import { PasswordWithOutBorderField } from "src/components/FormElementsv2/PasswordField/PasswordWithOutBorderField";
import JsonIcon from "src/components/Icons/RestoreInstance/JsonIcon";
import ArrayIcon from "src/components/Icons/RestoreInstance/ArrayIcon";
import ResourceInstanceDialog from "./ResourceInstanceDialog";
import AwsLogo from "src/components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "src/components/Logos/GcpLogo/GcpLogo";
import AzureLogo from "src/components/Logos/AzureLogo/AzureLogo";
import JSONViewModal from "./JSONViewModal";
import Tooltip from "src/components/Tooltip/Tooltip";

export type Row = {
  label: string;
  description?: string;
  value: any;
  valueType?:
    | "custom"
    | "text"
    | "link-box"
    | "link"
    | "password"
    | "boolean"
    | "Password"
    | "Boolean"
    | "String"
    | "string"
    | "float64"
    | "Float64"
    | "Secret"
    | "secret"
    | "array"
    | "json"
    | "cloudProvider"
    | "JSON"
    | "Any";
  linkProps?: {
    href: string;
    target?: "_blank" | "_self";
  };
};

const textType = [
  "String",
  "string",
  "text",
  "float64",
  "Float64",
  "Secret",
  "secret",
];

type PropertyTableProps = {
  rows: { rows: Row[]; title: string; desc: string; flexWrap: boolean };
} & BoxProps;

interface JsonDataType {
  [key: string]: unknown;
}

const PropertyDetails: FC<PropertyTableProps> = ({ rows, ...otherProps }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState<Row | null>(null);
  const [jsonViewModalOpen, setJsonViewModalOpen] = useState(false);
  const [jsonData, setJsonData] = useState<object | null>(null);

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

  return (
    <Box
      borderRadius="8px"
      border="1px solid #EAECF0"
      padding="12px 12px 0px 12px"
      boxShadow="inset 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1)"
      {...otherProps}
    >
      <Stack
        sx={{
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid #E4E7EC",
          paddingBottom: "12px",
        }}
        alignItems="left"
      >
        <Text size="small" weight="semibold" color="#6941C6">
          {rows.title}
        </Text>
        <Text size="small" weight="regular" color="#475467">
          {rows.desc}
        </Text>
      </Stack>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        position={"relative"}
        gap="12px"
        padding="12px 0"
      >
        <Box
          position={"absolute"}
          right={0}
          height={"100%"}
          width={"2px"}
          bgcolor={"white"}
        />

        {rows?.rows?.map((row, index) => {
          const valueType = row.valueType || "text";
          let { value } = row;

          //check for JSON data types
          let isJSONData = false;
          let jsonData: JsonDataType;

          if (
            value !== null &&
            value !== undefined &&
            typeof value === "object" &&
            valueType !== "custom"
          ) {
            try {
              if (value.constructor === {}.constructor) {
                jsonData = value;
                isJSONData = true;
              }
              //eslint-disable-next-line
            } catch (err) {}
          }

          if (typeof value === "string") {
            try {
              const parsed = JSON.parse(value);
              if (typeof parsed === "object") {
                jsonData = parsed;
                isJSONData = true;
              }

              //eslint-disable-next-line
            } catch (error) {}
          }

          if (!row.value) {
            value = null;
          } else if (isJSONData) {
            value = (
              <>
                {valueType === "array" ? <ArrayIcon /> : <JsonIcon />}

                <Box
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#6941C6",
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    setJsonViewModalOpen(true);
                    setData(row);
                    setJsonData(jsonData);
                  }}
                >
                  {"Click here to view"}
                </Box>
              </>
            );
          } else if (textType.includes(valueType)) {
            value = (
              <>
                <Tooltip title={row.value} placement="top">
                  <Box maxWidth="calc(100% - 36px)">
                    <Text
                      ellipsis
                      size="small"
                      weight="regular"
                      color="#475467"
                    >
                      {row.value}
                    </Text>
                  </Box>
                </Tooltip>
                <CopyButton
                  text={row.value}
                  iconProps={{ color: "#6941C6", width: 20, height: 20 }}
                  iconStyle={{ flexShrink: 0 }}
                />
              </>
            );
          } else if (valueType === "link") {
            value = (
              <>
                <Link
                  href={row.linkProps?.href || "#"}
                  target={row.linkProps?.target || "_self"}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#7F56D9",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                  }}
                >
                  {row.value}
                </Link>
                <CopyButton
                  text={row.value}
                  iconProps={{ color: "#6941C6", width: 20, height: 20 }}
                  iconStyle={{ flexShrink: 0 }}
                />
              </>
            );
          } else if (valueType === "link-box") {
            value = (
              <>
                <Text
                  size="small"
                  weight="regular"
                  color="#6941C6"
                  ellipsis
                  sx={{ flex: 1, wordBreak: "break-word" }}
                >
                  {row.value}
                </Text>
                <CopyButton
                  text={row.value}
                  iconProps={{ color: "#6941C6", width: 20, height: 20 }}
                  iconStyle={{ flexShrink: 0 }}
                />
              </>
            );
          } else if (valueType === "boolean" || valueType === "Boolean") {
            const statusStylesAndMap =
              getResourceInstanceDetailsStatusStylesAndLabel(row.value);
            value = <StatusChip {...statusStylesAndMap} />;
          } else if (valueType === "password" || valueType === "Password") {
            value = (
              <>
                <PasswordWithOutBorderField>
                  {row.value}
                </PasswordWithOutBorderField>
                <CopyButton
                  text={row.value}
                  iconProps={{
                    color: "#6941C6",
                    width: 20,
                    height: 20,
                  }}
                  iconStyle={{ flexShrink: 0 }}
                  iconButtonProps={{ p: 0 }}
                />
              </>
            );
          } else if (valueType === "cloudProvider") {
            value =
              row.value === "aws" ? (
                <AwsLogo />
              ) : row.value === "gcp" ? (
                <GcpLogo />
              ) : row.value === "azure" ? (
                <AzureLogo />
              ) : (
                "-"
              );
          } else {
            // Custom value type
            value = (
              <Box
                display={"flex"}
                justifyContent={"center"}
                textAlign={"center"}
                sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
              >
                {row.value}
              </Box>
            );
          }

          return (
            <Box
              key={index}
              p="20px"
              paddingLeft={"8px"}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              borderRight="1px solid #EAECF0"
              boxSizing="border-box"
              minHeight="80px"
            >
              <Tooltip title={row.label} placement="top">
                <Box maxWidth="100%">
                  <Text ellipsis size="small" weight="medium" color="#101828">
                    {row.label}
                  </Text>
                </Box>
              </Tooltip>
              <Box
                flex="1 1 auto"
                display="flex"
                alignItems="center"
                maxWidth="100%"
              >
                {value}
              </Box>
            </Box>
          );
        })}
      </Box>
      <ResourceInstanceDialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        variant={data?.valueType}
        data={data?.value}
        title={data?.label}
        subtitle={data?.description}
      />

      <JSONViewModal
        open={jsonViewModalOpen}
        handleClose={() => {
          setJsonViewModalOpen(false);
        }}
        parameterName={data?.label}
        parameterDescription={data?.description}
        jsonData={jsonData}
      />
    </Box>
  );
};

export default PropertyDetails;
