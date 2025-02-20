import { Box, BoxProps, Stack, styled } from "@mui/material";
import { FC, ReactNode, useState } from "react";
import NextLink from "next/link";
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
import { colors } from "src/themeConfig";

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

const Link = styled(NextLink)({
  color: "#535862",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "20px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "inline-block",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  "&:hover": {
    color: colors.blue600,
  },
});

type ConatainerCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  contentBoxProps?: BoxProps;
};

export const ContainerCard: FC<ConatainerCardProps & BoxProps> = (props) => {
  const {
    title,
    description,
    children,
    contentBoxProps = {},
    ...restProps
  } = props;

  return (
    <Box
      borderRadius="8px"
      border="1px solid #E9EAEB"
      boxShadow="0px 1px 2px 0px #0A0D120D"
      {...restProps}
    >
      <Stack
        sx={{
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid #E4E7EC",
        }}
        alignItems="left"
        padding="20px 24px"
      >
        <Text size="small" weight="bold" color={colors.blue900}>
          {title}
        </Text>
        <Text size="small" weight="regular" color="#535862" marginTop="2px">
          {description}
        </Text>
      </Stack>
      <Box {...contentBoxProps}>{children}</Box>
    </Box>
  );
};

const PropertyDetails: FC<PropertyTableProps> = ({ rows, ...otherProps }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState<Row | null>(null);
  const [jsonViewModalOpen, setJsonViewModalOpen] = useState(false);
  const [jsonData, setJsonData] = useState<object | null>(null);

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

  return (
    <ContainerCard title={rows.title} description={rows.desc} {...otherProps}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        position={"relative"}
        padding="12px 0"
        rowGap="12px"
      >
        <Box
          position={"absolute"}
          right={0}
          height={"100%"}
          width={"2px"}
          bgcolor={"white"}
          bottom={5}
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
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: colors.blue600,
                    cursor: "pointer",
                    marginLeft: "3px",
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
                    <Text ellipsis size="small" weight="medium" color="#535862">
                      {row.value}
                    </Text>
                  </Box>
                </Tooltip>
                <CopyButton
                  text={row.value}
                  iconProps={{ color: colors.blue600, width: 20, height: 20 }}
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
                >
                  {row.value}
                </Link>
                <CopyButton
                  text={row.value}
                  iconProps={{ color: colors.blue600, width: 20, height: 20 }}
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
                  color={colors.blue600}
                  ellipsis
                  sx={{ flex: 1, wordBreak: "break-word" }}
                >
                  {row.value}
                </Text>
                <CopyButton
                  text={row.value}
                  iconProps={{ color: colors.blue600, width: 20, height: 20 }}
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
                    color: colors.blue600,
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
              p="4px 24px 14px 24px"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              borderRight="1px solid #EAECF0"
              boxSizing="border-box"
              minHeight="80px"
              // border="1px solid blue"
            >
              <Tooltip title={row.label} placement="top">
                <Box maxWidth="100%">
                  <Text
                    ellipsis
                    size="xsmall"
                    weight="semibold"
                    color="#414651"
                  >
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
    </ContainerCard>
  );
};

export default PropertyDetails;
