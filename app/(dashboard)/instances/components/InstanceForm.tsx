"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createResourceInstance,
  updateResourceInstance,
} from "src/api/resourceInstance";
import useSnackbar from "src/hooks/useSnackbar";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { getMainResourceFromInstance } from "../utils";
import { Text } from "src/components/Typography/Typography";
import useResourceSchema from "../hooks/useResourceSchema";
import useAvailabilityZone from "src/hooks/query/useAvailabilityZone";
import Form from "src/components/FormElementsv2/Form/Form";
import Button from "src/components/Button/Button";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import { colors } from "src/themeConfig";
import CardWithTitle from "src/components/Card/CardWithTitle";
import GridDynamicField from "src/components/DynamicForm/GridDynamicField";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import {
  getDeploymentConfigurationFields,
  getNetworkConfigurationFields,
  getStandardInformationFields,
} from "./InstanceFormFields";
import { describeServiceOfferingResource } from "src/api/serviceOffering";

const InstanceForm = ({
  formMode,
  onClose,
  selectedInstance,
  refetchInstances,
}) => {
  const snackbar = useSnackbar();
  const {
    subscriptions,
    serviceOfferings,
    serviceOfferingsObj,
    servicesObj,
    isFetchingServiceOfferings,
    subscriptionsObj,
    isFetchingSubscriptions,
  } = useGlobalData();

  const selectedSubscription = useMemo(() => {
    return subscriptions.find(
      (sub) => sub.id === selectedInstance?.subscriptionId
    );
  }, [selectedInstance, subscriptions]);

  const createInstanceMutation = useMutation(
    async (payload: any) => {
      return createResourceInstance(payload);
      // const { data } = await createResourceInstance(payload);
      // const service =
      //   serviceOfferingsObj[payload.serviceId]?.[payload.servicePlanId]
      //     ?.offering;

      // Fetch the New Instance to Update the Query Data
      // const instanceData = await getResourceInstanceDetails(
      //   payload.serviceProviderId,
      //   payload.serviceKey,
      //   payload.serviceAPIVersion,
      //   payload.serviceEnvironmentKey,
      //   payload.serviceModelKey,
      //   payload.productTierKey,
      //   payload.resourceKey,
      //   data.id,
      //   payload.subscriptionId
      // );

      // This Data will be used to update the Query Data
      // return {
      //   ...instanceData.data,
      //   serviceProviderId: payload.serviceProviderId,
      //   serviceURLKey: payload.serviceKey,
      //   serviceAPIVersion: payload.serviceAPIVersion,
      //   serviceEnvironmentURLKey: payload.serviceEnvironmentKey,
      //   serviceModelURLKey: payload.serviceModelKey,
      //   productTierURLKey: payload.productTierKey,
      //   resourceKey: payload.resourceKey,
      //   instanceId: data.id,
      //   subscriptionId: payload.subscriptionId,
      //   serviceId: service?.serviceId,
      //   serviceEnvironmentID: service?.serviceEnvironmentID,
      //   productTierID: service?.productTierID,
      // };
    },
    {
      onSuccess: () => {
        snackbar.showSuccess("Instance created successfully");
        refetchInstances();
        formData.resetForm();
        onClose();
      },
    }
  );

  const updateResourceInstanceMutation = useMutation(updateResourceInstance, {
    onSuccess: () => {
      refetchInstances();
      formData.resetForm();
      snackbar.showSuccess("Updated Resource Instance");
      onClose();
    },
  });

  const formData = useFormik({
    initialValues: {
      serviceId: selectedSubscription?.serviceId || "",
      servicePlanId: selectedSubscription?.productTierId || "",
      subscriptionId: selectedInstance?.subscriptionId || "",
      // @ts-ignore
      resourceId: getMainResourceFromInstance(selectedInstance)?.id || "",
      cloudProvider: selectedInstance?.cloudProvider || "",
      region: selectedInstance?.region || "",
      networkType: "",
      requestParams: {
        ...(selectedInstance?.result_params || {}),
      },
    },
    validationSchema: yup.object({
      serviceId: yup.string().required("Service is required"),
      servicePlanId: yup.string().required("Service Plan is required"),
      subscriptionId: yup.string().required("Subscription is required"),
      resourceId: yup.string().required("Resource is required"),
    }),
    onSubmit: async (values) => {
      const offering =
        serviceOfferingsObj[values.serviceId]?.[values.servicePlanId];
      const selectedResource = offering?.resourceParameters.find(
        (resource) => resource.resourceId === values.resourceId
      );

      const data: any = {
        ...values,
        serviceProviderId: offering?.serviceProviderId,
        serviceKey: offering?.serviceURLKey,
        serviceAPIVersion: offering?.serviceAPIVersion,
        serviceEnvironmentKey: offering?.serviceEnvironmentURLKey,
        serviceModelKey: offering?.serviceModelURLKey,
        productTierKey: offering?.productTierURLKey,
        resourceKey: selectedResource?.urlKey,
      };

      const schema = await describeServiceOfferingResource(
        values.serviceId,
        values.resourceId,
        selectedInstance?.id || "none"
      );

      if (formMode === "create") {
        const createSchema = schema.data?.apis?.find(
          (api) => api.verb === "CREATE"
        )?.inputParameters;

        let isTypeError = false;
        Object.keys(data.requestParams).forEach((key) => {
          const result = createSchema.find((schemaParam) => {
            return schemaParam.key === key;
          });

          switch (result?.type) {
            case "Number":
              data.requestParams[key] = Number(data.requestParams[key]);
              break;
            case "Float64":
              const output = Number(data.requestParams[key]);
              if (!Number.isNaN(output)) {
                data.requestParams[key] = Number(data.requestParams[key]);
              } else {
                snackbar.showError(`Invalid data in ${key}`);
                isTypeError = true;
              }
              break;
            case "Boolean":
              if (data.requestParams[key] === "true")
                data.requestParams[key] = true;
              else data.requestParams[key] = false;
              break;
          }
        });

        for (const key in data.requestParams) {
          const value = data.requestParams[key];

          if (
            value === undefined ||
            (typeof value === "string" && !value.trim())
          ) {
            delete data.requestParams[key];
          }
        }

        // Remove cloud_provider_native_network_id if cloudProvider is GCP
        if (data.cloudProvider === "GCP") {
          delete data.requestParams.cloud_provider_native_network_id;
        }

        // Check for Required Fields
        const requiredFields = createSchema
          .filter(
            (field) =>
              ![
                "cloud_provider",
                "network_type",
                "region",
                "custom_network_id",
              ].includes(field.key)
          )
          .filter((schemaParam) => schemaParam.required);

        data.cloud_provider = data.cloudProvider;
        data.network_type = data.networkType;
        if (!data.cloudProvider) {
          return snackbar.showError("Cloud Provider is required");
        } else if (!data.region) {
          return snackbar.showError("Region is required");
        } else if (!data.networkType) {
          return snackbar.showError("Network Type is required");
        }

        for (const field of requiredFields) {
          if (!data.requestParams[field.key]) {
            snackbar.showError(`${field.key} is required`);
            return;
          }
        }

        if (!isTypeError) {
          createInstanceMutation.mutate(data);
        }
      } else {
        const updateSchema = schema.data?.apis?.find(
          (api) => api.verb === "UPDATE"
        )?.inputParameters;

        // Only send the fields that have changed
        const requestParams = {},
          oldResultParams = selectedInstance?.result_params;

        for (const key in data.requestParams) {
          const value = data.requestParams[key];
          if (oldResultParams[key] !== value) {
            requestParams[key] = value;
          }
        }

        data.requestParams = requestParams;

        if (!Object.keys(requestParams).length) {
          return snackbar.showError(
            "Please update at least one field before submitting"
          );
        }

        let isTypeError = false;
        Object.keys(data.requestParams).forEach((key) => {
          const result = updateSchema.find((schemaParam) => {
            return schemaParam.key === key;
          });

          switch (result?.type) {
            case "Number":
              data.requestParams[key] = Number(data.requestParams[key]);
              break;
            case "Float64":
              const output = Number(data.requestParams[key]);
              if (!Number.isNaN(output)) {
                data.requestParams[key] = Number(data.requestParams[key]);
              } else {
                snackbar.showError(`Invalid data in ${key}`);
                isTypeError = true;
              }
              break;
            case "Boolean":
              if (data.requestParams[key] === "true")
                data.requestParams[key] = true;
              else data.requestParams[key] = false;
              break;
          }
        });

        // Remove Empty Fields from data.requestParams
        for (const key in data.requestParams) {
          const value = data.requestParams[key];

          if (
            value === undefined ||
            (typeof value === "string" && !value.trim())
          ) {
            delete data.requestParams[key];
          }
        }

        // Check for Required Fields
        const requiredFields = updateSchema
          .filter(
            (field) =>
              ![
                "cloud_provider",
                "network_type",
                "region",
                "custom_network_id",
              ].includes(field.key)
          )
          .filter((schemaParam) => schemaParam.required);

        data.cloud_provider = data.cloudProvider;
        data.network_type = data.networkType;
        if (!data.cloudProvider) {
          return snackbar.showError("Cloud Provider is required");
        } else if (!data.region) {
          return snackbar.showError("Region is required");
        } else if (!data.networkType) {
          return snackbar.showError("Network Type is required");
        }

        for (const field of requiredFields) {
          if (!data.requestParams[field.key]) {
            snackbar.showError(`${field.key} is required`);
            return;
          }
        }

        if (!isTypeError) {
          updateResourceInstanceMutation.mutate(data);
        }
      }
    },
  });

  const {
    data: resourceSchema = {},
    isFetching: isFetchingResourceSchema,
  }: any = useResourceSchema({
    serviceId: formData.values.serviceId,
    resourceId: formData.values.resourceId,
    instanceId: selectedInstance?.id,
  });

  const {
    data: customAvailabilityZoneData,
    isLoading: isFetchingCustomAvailabilityZones,
  } = useAvailabilityZone(
    formData.values.region,
    formData.values.cloudProvider
  );

  // Sets the Default Values for the Request Parameters
  useEffect(() => {
    const inputParameters = resourceSchema?.inputParameters || [];

    const defaultValues = inputParameters.reduce((acc: any, param: any) => {
      acc[param.key] = param.defaultValue || "";
      return acc;
    }, {});

    if (inputParameters.length && formMode === "create") {
      formData.setValues((prev) => ({
        ...prev,
        requestParams: defaultValues,
      }));
    }
  }, [resourceSchema, formMode]);

  const customAvailabilityZones = useMemo(() => {
    const availabilityZones = customAvailabilityZoneData?.availabilityZones;
    return availabilityZones?.sort(function (a, b) {
      if (a.code < b.code) return -1;
      else if (a.code > b.code) {
        return 1;
      }
      return -1;
    });
  }, [customAvailabilityZoneData?.availabilityZones]);

  const standardInformationFields = useMemo(() => {
    return getStandardInformationFields(
      servicesObj,
      serviceOfferings,
      serviceOfferingsObj,
      isFetchingServiceOfferings,
      subscriptions,
      subscriptionsObj,
      isFetchingSubscriptions,
      formData,
      resourceSchema,
      formMode,
      customAvailabilityZones,
      isFetchingCustomAvailabilityZones
    );
  }, [formMode, formData.values, resourceSchema, customAvailabilityZones]);

  const networkConfigurationFields = useMemo(() => {
    return getNetworkConfigurationFields(
      formMode,
      formData.values,
      resourceSchema,
      serviceOfferingsObj
    );
  }, [formMode, formData.values, resourceSchema, serviceOfferingsObj]);

  const deploymentConfigurationFields = useMemo(() => {
    return getDeploymentConfigurationFields(
      formMode,
      formData.values,
      resourceSchema
    );
  }, [formMode, formData.values, resourceSchema]);

  const sections = useMemo(
    () => [
      {
        title: "Standard Information",
        fields: standardInformationFields,
      },
      {
        title: "Network Configuration",
        fields: networkConfigurationFields,
      },
      {
        title: "Deployment Configuration",
        fields: deploymentConfigurationFields,
      },
    ],
    [formData.values]
  );

  return (
    // @ts-ignore
    <Form className="flex items-start gap-8" onSubmit={formData.handleSubmit}>
      <div style={{ flex: 5 }} className="space-y-6">
        <CardWithTitle title="Standard Information">
          <div className="space-y-6">
            {standardInformationFields.map((field, index) => {
              return (
                <GridDynamicField
                  key={index}
                  field={field}
                  formData={formData}
                />
              );
            })}
          </div>
        </CardWithTitle>
        {!networkConfigurationFields.length ? null : (
          <CardWithTitle title="Network Configuration">
            <div className="space-y-6">
              {networkConfigurationFields.map((field, index) => {
                return (
                  <GridDynamicField
                    key={index}
                    field={field}
                    formData={formData}
                  />
                );
              })}
            </div>
          </CardWithTitle>
        )}
        {isFetchingResourceSchema ? (
          <LoadingSpinner />
        ) : !deploymentConfigurationFields.length ? null : (
          <CardWithTitle title="Deployment Configuration">
            <div className="space-y-6">
              {deploymentConfigurationFields.map((field, index) => {
                return (
                  <GridDynamicField
                    key={index}
                    field={field}
                    formData={formData}
                  />
                );
              })}
            </div>
          </CardWithTitle>
        )}
      </div>

      <div
        style={{
          position: "sticky",
          top: "24px",
          flex: 2,
          minHeight: "660px",
          border: `1px solid ${colors.purple600}`,
          boxShadow: "0px 2px 2px -1px #0A0D120A, 0px 4px 6px -2px #0A0D1208",
        }}
        className="bg-white rounded-xl flex flex-col"
      >
        <div className="py-4 px-6 border-b border-gray-200">
          <Text size="large" weight="semibold" color={colors.purple700}>
            Deployment Instance Summary
          </Text>
        </div>

        <div className="px-4 py-4 flex-1">
          {sections.map((section, index) => {
            if (!section.fields.length) return null;

            return (
              <div key={index}>
                <Text
                  size="small"
                  weight="semibold"
                  color={colors.purple700}
                  sx={{ my: "10px" }}
                >
                  {section.title}
                </Text>

                <div
                  className="grid grid-cols-5"
                  style={{
                    gap: "10px 8px",
                  }}
                >
                  {section.fields.map((field, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div
                          style={{
                            gridColumn: "span 2 / span 2",
                          }}
                        >
                          <Text size="small" weight="medium" color="#414651">
                            {field.label}
                          </Text>
                        </div>
                        <div className="col-span-3 flex">
                          <div style={{ margin: "-3px 8px 0px 0px" }}>:</div>
                          <div>
                            {field.previewValue ? (
                              <field.previewValue
                                field={field}
                                formData={formData}
                              />
                            ) : typeof formData.values[field.name] ===
                              "string" ? (
                              <Text
                                size="small"
                                weight="medium"
                                color={colors.gray900}
                              >
                                {formData.values[field.name]}
                              </Text>
                            ) : null}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            margin: "0px 16px 20px",
            paddingTop: "20px",
            borderTop: "1px solid #E9EAEB",
          }}
          className="flex items-center gap-3"
        >
          {onClose && (
            <Button
              data-testid="cancel-button"
              variant="outlined"
              onClick={onClose}
              disabled={
                createInstanceMutation.isLoading ||
                updateResourceInstanceMutation.isLoading
              }
              sx={{ marginLeft: "auto" }} // Pushes the 2 buttons to the end
            >
              Cancel
            </Button>
          )}
          <Button
            data-testid="submit-button"
            variant="contained"
            disabled={
              createInstanceMutation.isLoading ||
              updateResourceInstanceMutation.isLoading
            }
            type="submit"
          >
            {formMode === "create" ? "Create" : "Update"}
            {(createInstanceMutation.isLoading ||
              updateResourceInstanceMutation.isLoading) && (
              <LoadingSpinnerSmall />
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default InstanceForm;
