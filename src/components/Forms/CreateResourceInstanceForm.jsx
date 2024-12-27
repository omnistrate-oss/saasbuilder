import {
  Box,
  CircularProgress,
  Link,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../Button/Button";
import FieldContainer from "../FormElements/FieldContainer/FieldContainer";
import FieldDescription from "../FormElementsv2/FieldDescription/FieldDescription";
import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import Form from "../FormElements/Form/Form";
import { FormControlLabel } from "../FormElements/Radio/Radio";
import TextField from "../FormElementsv2/TextField/TextField";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import { describeServiceOfferingResource } from "../../api/serviceOffering";
import Select from "../FormElements/Select/Select";
import useResourcesInstanceIds from "../../hooks/useResourcesInstanceIds";
import { ACCOUNT_CREATION_METHODS } from "src/utils/constants/accountConfig";
import useAvailabilityZone from "src/hooks/query/useAvailabilityZone";
import { PasswordField } from "../FormElementsv2/PasswordField/PasswordField";
import {
  CLOUD_PROVIDERS,
  cloudProviderLabels,
} from "src/constants/cloudProviders";
import {
  AWSAccountIDDescription,
  GCPProjectIDDescription,
  GCPProjectNumberDescription,
} from "./AccountConfigFormElements";
import Autocomplete, {
  StyledTextField,
} from "../FormElementsv2/AutoComplete/AutoComplete";
import useCustomNetworks from "src/features/CustomNetworks/hooks/useCustomNetworks";
import FormTitle from "../FormElements/FormTitle/FormTitle";
import FormDescription from "../FormElements/FormDescription/FormDescription";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function CreateResourceInstanceForm(props) {
  const {
    formData,
    isLoading,
    formCancelClick,
    regions,
    serviceId,
    selectedResourceKey,
    isBYOA,
    setRequestParams,
    cloudProviderAccounts,
    cloudProviders,
    service,
    subscriptionId,
    isCustomNetworkEnabled = false,
  } = props;

  const [isSchemaLoading, setIsSchemaLoading] = useState(true);
  const [createSchema, setCreateSchema] = useState([]);
  const { isFetching, data: resourceIdInstancesHashMap = {} } =
    useResourcesInstanceIds(
      service?.serviceProviderId,
      service?.serviceURLKey,
      service?.serviceAPIVersion,
      service?.serviceEnvironmentURLKey,
      service?.serviceModelURLKey,
      service?.productTierURLKey,
      service?.resourceParameters,
      subscriptionId
    );

  const customNetworksQuery = useCustomNetworks({
    enabled: isCustomNetworkEnabled,
  });

  const { data: customNetworks = [] } = customNetworksQuery;

  const customNetworkOptions = useMemo(() => {
    let options = customNetworks;
    const selectedProvider = formData.values.cloud_provider;
    const selectedRegion = formData.values.region;
    if (selectedProvider) {
      options = customNetworks.filter((customNetwork) => {
        return customNetwork.cloudProviderName === selectedProvider;
      });
      //filter the custom networks by supported regions for the selected cloud provider
      const supportedRegions = regions[selectedProvider] || [];
      options = customNetworks.filter((customNetwork) => {
        return supportedRegions.includes(customNetwork.cloudProviderRegion);
      });
    }
    if (selectedRegion) {
      options = customNetworks.filter((customNetwork) => {
        return customNetwork.cloudProviderRegion === selectedRegion;
      });
    }

    return options;
  }, [
    formData.values.cloud_provider,
    formData.values.region,
    customNetworks,
    regions,
  ]);

  useEffect(() => {
    async function getSchema() {
      setIsSchemaLoading(true);
      const schema = await describeServiceOfferingResource(
        serviceId,
        selectedResourceKey.id,
        "none"
      );

      schema.data.apis.forEach((api) => {
        if (api.verb === "CREATE") {
          if (api.inputParameters) {
            let sortedInputParams = [];

            //getting cloud_provider_account_config_id as first item of array if it exists
            sortedInputParams = sortedInputParams.concat(
              api.inputParameters.filter(
                (param) => param.key === "cloud_provider_account_config_id"
              )
            );
            //rest if the items
            sortedInputParams = sortedInputParams.concat(
              api.inputParameters.filter(
                (param) => param.key !== "cloud_provider_account_config_id"
              )
            );

            setCreateSchema(
              sortedInputParams?.sort((a, b) => a?.key.localeCompare(b?.key))
            );
            const createSchemaForDefValue = {};
            api.inputParameters.forEach((kv) => {
              if (kv.defaultValue)
                if (kv.defaultValue === "[]") {
                  createSchemaForDefValue[kv.key] = [];
                } else {
                  createSchemaForDefValue[kv.key] = kv.defaultValue;
                }
              else {
                if (kv.custom) createSchemaForDefValue[kv.key] = "";
              }
            });
            setRequestParams(createSchemaForDefValue);
          }
        }
      });
      setIsSchemaLoading(false);
    }
    getSchema();
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, []);

  const cloudProviderFieldExists = createSchema.find(
    (field) => field.key === "cloud_provider"
  );

  const regionFieldExists = createSchema.find(
    (field) => field.key === "region"
  );

  const customNetworkFieldExists = createSchema.find(
    (field) => field.key === "custom_network_id"
  );
  const customAvailabilityZoneFieldExists = createSchema.find(
    (field) => field.key === "custom_availability_zone"
  );

  const accountCreationMethods = useMemo(() => {
    const options = [];
    if (formData.values.cloud_provider === "aws") {
      options.push(ACCOUNT_CREATION_METHODS.CLOUDFORMATION);
    }
    options.push(ACCOUNT_CREATION_METHODS.TERRAFORM);
    return options;
  }, [formData.values.cloud_provider]);

  const shouldShowParamField = useCallback(
    (paramKey) => {
      if (
        paramKey === "aws_bootstrap_role_arn" ||
        paramKey === "account_configuration_method" ||
        paramKey === "gcp_service_account_email"
      ) {
        return false;
      }

      // formData.values.cloud_provider can be 'aws', 'gcp' or 'azure'. Field names with same prefix must be shown
      if (
        formData.values.cloud_provider &&
        paramKey.startsWith(formData.values.cloud_provider)
      ) {
        return true;
      }
      return false;
    },
    [formData.values.cloud_provider]
  );
  const customAvailabilityZoneQuery = useAvailabilityZone(
    formData.values.region,
    formData.values.cloud_provider
  );

  const { data: customAvailabilityZoneData } = customAvailabilityZoneQuery;

  const customAvailabilityZone = useMemo(() => {
    const availabilityZones = customAvailabilityZoneData?.availabilityZones;
    return availabilityZones?.sort(function (a, b) {
      if (a.code < b.code) return -1;
      else if (a.code > b.code) {
        return 1;
      }
      return -1;
    });
  }, [customAvailabilityZoneData?.availabilityZones]);

  const selectedCustomNetworkId = formData.values?.custom_network_id ?? "";

  const networkTypeFieldExists =
    cloudProviderFieldExists &&
    !isCustomNetworkEnabled &&
    service?.supportsPublicNetwork;

  if (isSchemaLoading)
    return (
      <Stack alignItems="center" sx={{ mt: "300px" }}>
        <CircularProgress />
      </Stack>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <FormTitle> Create {selectedResourceKey.name} Instance</FormTitle>
      <FormDescription>
        Create new Instance of {selectedResourceKey.name}
      </FormDescription>

      <Form onSubmit={formData.handleSubmit} sx={{ width: "100%" }}>
        {cloudProviderFieldExists && (
          <FieldContainer>
            <FieldLabel required>Cloud Provider</FieldLabel>
            <FieldDescription sx={{ mt: "5px" }}>
              Select the cloud provider
            </FieldDescription>
            <TextField
              select
              id="cloud_provider"
              name="cloud_provider"
              value={formData.values.cloud_provider ?? ""}
              onChange={(e) => {
                if (regionFieldExists) {
                  formData.setFieldValue("region", "");
                }
                if (customNetworkFieldExists) {
                  formData.setFieldValue("custom_network_id", "");
                }
                formData.handleChange(e);
              }}
              sx={{ marginTop: "16px" }}
            >
              {cloudProviders.map((option) => (
                <MenuItem key={option} value={option}>
                  {cloudProviderLabels[option]}
                </MenuItem>
              ))}
            </TextField>
            <ErrorLabel>
              {formData.touched.cloud_provider &&
                formData.errors.cloud_provider}
            </ErrorLabel>
          </FieldContainer>
        )}

        {regionFieldExists && (
          <FieldContainer>
            <FieldLabel required>Region</FieldLabel>
            <TextField
              select
              sx={{ marginTop: "16px" }}
              id="region"
              name="region"
              value={formData.values.region ?? ""}
              onChange={(e) => {
                if (customAvailabilityZoneFieldExists) {
                  formData.setFieldValue(
                    "requestParams.custom_availability_zone",
                    ""
                  );
                }
                if (customNetworkFieldExists) {
                  formData.setFieldValue("custom_network_id", "");
                }
                formData.handleChange(e);
              }}
              input={<OutlinedInput />}
            >
              <MenuItem disabled value="">
                <em>None</em>
              </MenuItem>
              {regions[formData.values.cloud_provider]?.map((region) => (
                <MenuItem key={region} value={region}>
                  {formData.values.cloud_provider} - {region}
                </MenuItem>
              ))}
            </TextField>
          </FieldContainer>
        )}

        {networkTypeFieldExists && (
          <FieldContainer>
            <FieldLabel required>Network Type</FieldLabel>
            <FieldDescription sx={{ mt: "5px" }}>
              Type of Network
            </FieldDescription>
            <TextField
              select
              id="network_type"
              name="network_type"
              value={formData.values.network_type ?? ""}
              onChange={formData.handleChange}
              sx={{ marginTop: "16px" }}
            >
              {[{ Public: "PUBLIC" }, { Internal: "INTERNAL" }].map((item) =>
                Object.entries(item).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))
              )}
            </TextField>
            <ErrorLabel>
              {formData.touched.network_type && formData.errors.network_type}
            </ErrorLabel>
          </FieldContainer>
        )}

        {customNetworkFieldExists && (
          <FieldContainer>
            <FieldLabel required>Custom Network</FieldLabel>
            <TextField
              select
              sx={{ marginTop: "16px" }}
              id="custom_network_id"
              name="custom_network_id"
              value={selectedCustomNetworkId}
              onChange={(e) => {
                formData.handleChange(e);
                const selectedCustomNetworkID = e.target.value;
                const selectedCustomNetwork = customNetworks.find(
                  (customNetwork) => {
                    return customNetwork.id === selectedCustomNetworkID;
                  }
                );

                //auto select region if not already set
                if (!formData.values.region) {
                  formData.setFieldValue(
                    "region",
                    selectedCustomNetwork?.cloudProviderRegion
                  );
                }
              }}
            >
              <MenuItem disabled value="">
                <em>None</em>
              </MenuItem>
              {customNetworkOptions?.map((customNetwork) => (
                <MenuItem key={customNetwork.id} value={customNetwork.id}>
                  {customNetwork.name} - {customNetwork.cidr}
                </MenuItem>
              ))}
            </TextField>
          </FieldContainer>
        )}
        {customAvailabilityZoneFieldExists && (
          <FieldContainer>
            <FieldLabel required>Custom Availability Zone</FieldLabel>
            <TextField
              select
              sx={{ marginTop: "16px" }}
              id="requestParams.custom_availability_zone"
              name="requestParams.custom_availability_zone"
              value={
                formData.values?.requestParams?.custom_availability_zone ?? ""
              }
              onChange={formData.handleChange}
            >
              <MenuItem disabled value="">
                <em>None</em>
              </MenuItem>
              {customAvailabilityZone?.map((region) => (
                <MenuItem key={region.code} value={region.code}>
                  {region.cloudProviderName} - {region.code}
                </MenuItem>
              ))}
            </TextField>
          </FieldContainer>
        )}

        <Box mt={isBYOA ? 2 : 4}>
          {createSchema.filter(
            (param) =>
              param.custom === true && param.key !== "custom_availability_zone"
          ).length > 0 ? (
            <FieldLabel>Request Parameters</FieldLabel>
          ) : (
            ""
          )}
          {isBYOA && (
            <>
              <FieldContainer key="Cloud Provider">
                <FieldLabel required>Cloud Provider</FieldLabel>

                <FieldDescription sx={{ mt: "5px" }}>
                  The selection of the cloud provider platform, such as AWS or
                  GCP
                </FieldDescription>
                <Select
                  sx={{ display: "block", marginTop: "16px" }}
                  id="cloud_provider"
                  name="cloud_provider"
                  onChange={(e) => {
                    if (e.target.value === CLOUD_PROVIDERS.aws) {
                      formData.setFieldValue(
                        "configMethod",
                        ACCOUNT_CREATION_METHODS.CLOUDFORMATION
                      );
                    } else {
                      formData.setFieldValue(
                        "configMethod",
                        ACCOUNT_CREATION_METHODS.TERRAFORM
                      );
                    }
                    formData.handleChange(e);
                  }}
                  value={formData.values.cloud_provider ?? ""}
                  required
                  input={<OutlinedInput />}
                >
                  {cloudProviders.map((option) => (
                    <MenuItem key={option} value={option}>
                      {cloudProviderLabels[option]}
                    </MenuItem>
                  ))}
                </Select>
              </FieldContainer>

              <FieldContainer key="Account Configuration Method">
                <FieldLabel required> Account Configuration Method</FieldLabel>

                <FieldDescription sx={{ mt: "5px" }}>
                  Choose a method from among the options to configure your cloud
                  provider account
                </FieldDescription>
                <Select
                  sx={{ display: "block", marginTop: "16px" }}
                  id="configMethod"
                  name="configMethod"
                  onChange={formData.handleChange}
                  value={formData.values.configMethod ?? ""}
                  required
                  displayEmpty
                  input={<OutlinedInput />}
                >
                  {accountCreationMethods.map((confgiMethod) => (
                    <MenuItem key={confgiMethod} value={confgiMethod}>
                      {confgiMethod}{" "}
                      {confgiMethod ===
                        ACCOUNT_CREATION_METHODS.CLOUDFORMATION &&
                        "(Recommended)"}
                    </MenuItem>
                  ))}
                </Select>
              </FieldContainer>
            </>
          )}
          {createSchema.map((param) => {
            if (param.key !== "custom_availability_zone") {
              if (isBYOA && !shouldShowParamField(param.key)) {
                return null;
              }
              if (param.type === "Password") {
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <PasswordField
                      sx={{ color: "#FFF" }}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      onChange={formData.handleChange}
                      value={formData.values.requestParams[param.key] ?? ""}
                      onBlur={formData.handleBlur}
                      required={param.required == true ? true : false}
                      showPasswordGenerator
                    />
                  </FieldContainer>
                );
              }

              if (param.key === "cloud_provider_account_config_id") {
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <Select
                      sx={{ display: "block", marginTop: "16px" }}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      onChange={formData.handleChange}
                      values={formData.values.requestParams[param.key]}
                      input={<OutlinedInput />}
                    >
                      <MenuItem disabled value="">
                        <em>None</em>
                      </MenuItem>

                      {[
                        ...(cloudProviderFieldExists
                          ? cloudProviderAccounts?.filter(
                              (obj) =>
                                obj.type === formData.values.cloud_provider
                            )
                          : cloudProviderAccounts),
                      ].map((cloudProviderAccount) => (
                        <MenuItem
                          key={cloudProviderAccount.id}
                          value={cloudProviderAccount.id}
                        >
                          {cloudProviderAccount.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FieldContainer>
                );
              } else {
                if (param.custom === true && param.dependentResourceID) {
                  const dependentResourceId = param.dependentResourceID;
                  const options = resourceIdInstancesHashMap[
                    dependentResourceId
                  ]
                    ? resourceIdInstancesHashMap[dependentResourceId]
                    : [];
                  return (
                    <FieldContainer key={param.key}>
                      {param.required == true ? (
                        <FieldLabel required>{param.displayName}</FieldLabel>
                      ) : (
                        <FieldLabel>{param.displayName}</FieldLabel>
                      )}
                      <FieldDescription sx={{ mt: "5px" }}>
                        {param.description}
                      </FieldDescription>
                      <Select
                        isLoading={isFetching}
                        fullWidth
                        MenuProps={MenuProps}
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        value={
                          formData.values.requestParams[param.key]
                            ? formData.values.requestParams[param.key]
                            : []
                        }
                        displayEmpty
                        onChange={formData.handleChange}
                        sx={{ marginTop: "16px" }}
                        required={param.required == true ? true : false}
                      >
                        <MenuItem value={""} disabled={param.required}>
                          None
                        </MenuItem>
                        {options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FieldContainer>
                  );
                }
                if (param.custom == true && param.type == "Boolean") {
                  return (
                    <FieldContainer key={param.key}>
                      <FieldLabel required={param.required}>
                        {param.displayName}
                      </FieldLabel>
                      <FieldDescription sx={{ mt: "5px" }}>
                        {param.description}
                      </FieldDescription>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        value={
                          formData.values.requestParams[param.key]
                            ? formData.values.requestParams[param.key]
                            : "false"
                        }
                        onChange={formData.handleChange}
                        sx={{ marginTop: "16px" }}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label="True"
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label="False"
                        />
                      </RadioGroup>
                    </FieldContainer>
                  );
                } else if (
                  param.custom == true &&
                  param.options !== undefined &&
                  param.isList === true
                ) {
                  const options = param.options ? param.options : [""];
                  return (
                    <FieldContainer key={param.key}>
                      <FieldLabel required={param.required}>
                        {param.displayName}
                      </FieldLabel>

                      <FieldDescription sx={{ mt: "5px" }}>
                        {param.description}
                      </FieldDescription>
                      <Autocomplete
                        multiple
                        fullWidth
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        value={
                          formData.values.requestParams[param.key]
                            ? formData.values.requestParams[param.key]
                            : []
                        }
                        sx={{ marginTop: "16px" }}
                        options={options?.length > 0 ? options : []}
                        onChange={(e, value) => {
                          formData.setFieldValue(
                            `requestParams.${param.key}`,
                            value
                          );
                        }}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            required={param.required}
                          />
                        )}
                      />
                    </FieldContainer>
                  );
                } else if (
                  param.custom == true &&
                  param.options !== undefined &&
                  param.isList === false
                ) {
                  const options = param.options ? param.options : [""];
                  return (
                    <FieldContainer key={param.key}>
                      <FieldLabel required={param.required}>
                        {param.displayName}
                      </FieldLabel>
                      <FieldDescription sx={{ mt: "5px" }}>
                        {param.description}
                      </FieldDescription>

                      <Autocomplete
                        fullWidth
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        value={
                          formData.values.requestParams[param.key]
                            ? formData.values.requestParams[param.key]
                            : ""
                        }
                        sx={{ marginTop: "16px" }}
                        options={options?.length > 0 ? options : []}
                        onChange={(e, value) => {
                          formData.setFieldValue(
                            `requestParams.${param.key}`,
                            value
                          );
                        }}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            required={param.required}
                          />
                        )}
                      />
                    </FieldContainer>
                  );
                } else if (
                  param.custom === true ||
                  param.key === "cloud_provider_native_network_id"
                ) {
                  if (
                    param.key === "cloud_provider_native_network_id" &&
                    formData.values.cloud_provider === "gcp"
                  ) {
                    return null;
                  }

                  return (
                    <FieldContainer key={param.key}>
                      {param.required == true ? (
                        <FieldLabel required>{param.displayName}</FieldLabel>
                      ) : (
                        <FieldLabel>{param.displayName}</FieldLabel>
                      )}

                      <FieldDescription sx={{ mt: "5px" }}>
                        {param.description}
                        {param.key === "cloud_provider_native_network_id" && (
                          <>
                            {param?.description && <br />}
                            If you&apos;d like to deploy within your VPC, enter
                            its ID. Please ensure your VPC meets the{" "}
                            <Link
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                              }}
                              href="https://docs.omnistrate.com/usecases/byoa/?#bring-your-own-vpc-byo-vpc"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              prerequisites
                            </Link>
                            .{" "}
                          </>
                        )}

                        {param.key === "aws_account_id" && (
                          <AWSAccountIDDescription context="access" />
                        )}
                        {param.key === "gcp_project_id" && (
                          <GCPProjectIDDescription context="access" />
                        )}
                        {param.key === "gcp_project_number" && (
                          <GCPProjectNumberDescription context="access" />
                        )}
                      </FieldDescription>
                      {param.type === "Float64" ? (
                        <TextField
                          id={`requestParams.${param.key}`}
                          type="number"
                          name={`requestParams.${param.key}`}
                          value={formData.values.requestParams[param.key]}
                          onChange={formData.handleChange}
                          sx={{ marginTop: "16px" }}
                          modifiable={param.modifiable}
                          required={param.required == true ? "required" : ""}
                        />
                      ) : (
                        <TextField
                          multiline={true}
                          minRows={1}
                          maxRows={3}
                          id={`requestParams.${param.key}`}
                          name={`requestParams.${param.key}`}
                          value={formData.values.requestParams[param.key] ?? ""}
                          onChange={formData.handleChange}
                          sx={{ marginTop: "16px" }}
                          required={param.required == true ? true : false}
                        />
                      )}
                    </FieldContainer>
                  );
                }
              }
            }
          })}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap="10px" mt="40px">
          <Button
            variant="contained"
            bgColor="white"
            fontColor="black"
            sx={{
              border: " 1px solid #D1D5DB",
              height: "40px !important",
              padding: "10px 14px !important",
            }}
            onClick={formCancelClick}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
          >
            Create {selectedResourceKey.name} Instance{" "}
            {isLoading && (
              <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
            )}
          </Button>
        </Box>
      </Form>
    </Box>
  );
}

export default CreateResourceInstanceForm;
