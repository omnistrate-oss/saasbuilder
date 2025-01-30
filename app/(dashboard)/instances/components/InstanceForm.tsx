"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

import { colors } from "src/themeConfig";
import useSnackbar from "src/hooks/useSnackbar";
import { APIEntity } from "src/types/serviceOffering";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import useAvailabilityZone from "src/hooks/query/useAvailabilityZone";
import useResourcesInstanceIds from "src/hooks/useResourcesInstanceIds";
import { describeServiceOfferingResource } from "src/api/serviceOffering";
import {
  createResourceInstance,
  updateResourceInstance,
} from "src/api/resourceInstance";

import Button from "components/Button/Button";
import Form from "components/FormElementsv2/Form/Form";
import { Text } from "components/Typography/Typography";
import CardWithTitle from "components/Card/CardWithTitle";
import PreviewCard from "components/DynamicForm/PreviewCard";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import GridDynamicField from "components/DynamicForm/GridDynamicField";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";

import { getInitialValues } from "../utils";
import useResourceSchema from "../hooks/useResourceSchema";
import {
  getDeploymentConfigurationFields,
  getNetworkConfigurationFields,
  getStandardInformationFields,
} from "./InstanceFormFields";
import useCustomNetworks from "app/(dashboard)/custom-networks/hooks/useCustomNetworks";
import { CloudProvider } from "src/types/common/enums";
import { productTierTypes } from "src/constants/servicePlan";

const InstanceForm = ({
  formMode,
  instances,
  selectedInstance,
  refetchInstances,
  setOverlayType,
  setIsOverlayOpen,
  setCreateInstanceModalData,
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

  const { data: customNetworks = [], isFetching: isFetchingCustomNetworks } =
    useCustomNetworks({
      refetchOnMount: false,
    });

  const createInstanceMutation = useMutation(
    async (payload: any) => {
      return createResourceInstance(payload);
    },
    {
      onSuccess: (response) => {
        // Show the Create Instance Dialog
        setIsOverlayOpen(true);
        setOverlayType("create-instance-dialog");
        setCreateInstanceModalData({
          // @ts-ignore
          isCustomDNS: formData.values.requestParams?.custom_dns_configuration,
          instanceId: response.data?.id,
        });

        snackbar.showSuccess("Instance created successfully");
        refetchInstances();
        formData.resetForm();
      },
    }
  );

  const updateResourceInstanceMutation = useMutation(updateResourceInstance, {
    onSuccess: () => {
      refetchInstances();
      formData.resetForm();
      snackbar.showSuccess("Updated Resource Instance");
      setIsOverlayOpen(false);
    },
  });

  const formData = useFormik({
    initialValues: getInitialValues(
      selectedInstance,
      subscriptions,
      serviceOfferingsObj
    ),
    enableReinitialize: true,
    validationSchema: yup.object({
      serviceId: yup.string().required("Service is required"),
      servicePlanId: yup
        .string()
        .required("Plan with active subscription is required"),
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
        ...cloneDeep(values),
        serviceProviderId: offering?.serviceProviderId,
        serviceKey: offering?.serviceURLKey,
        serviceAPIVersion: offering?.serviceAPIVersion,
        serviceEnvironmentKey: offering?.serviceEnvironmentURLKey,
        serviceModelKey: offering?.serviceModelURLKey,
        productTierKey: offering?.productTierURLKey,
        resourceKey: selectedResource?.urlKey,
      };

      const schemaData = await describeServiceOfferingResource(
        values.serviceId,
        values.resourceId,
        selectedInstance?.id || "none"
      );

      const createSchema =
        schemaData.data?.apis?.find((api) => api.verb === "CREATE")
          ?.inputParameters || [];

      const updateSchema =
        schemaData.data?.apis?.find((api) => api.verb === "UPDATE")
          ?.inputParameters || [];

      const schema = formMode === "create" ? createSchema : updateSchema;
      const inputParametersObj = schema.reduce((acc: any, param: any) => {
        acc[param.key] = param;
        return acc;
      }, {});

      if (formMode === "create") {
        let isTypeError = false;
        Object.keys(data.requestParams).forEach((key) => {
          const result = schema.find((schemaParam) => {
            return schemaParam.key === key;
          });

          switch (result?.type?.toLowerCase()) {
            case "number":
              data.requestParams[key] = Number(data.requestParams[key]);
              break;
            case "float64":
              const output = Number(data.requestParams[key]);
              if (!Number.isNaN(output)) {
                data.requestParams[key] = Number(data.requestParams[key]);
              } else {
                snackbar.showError(`Invalid data in ${key}`);
                isTypeError = true;
              }
              break;
            case "boolean":
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
        const requiredFields = schema
          .filter((field) => !["cloud_provider", "region"].includes(field.key))
          .filter((schemaParam) => schemaParam.required);

        data.cloud_provider = data.cloudProvider;
        data.custom_network_id = data.requestParams.custom_network_id;

        const networkTypeFieldExists =
          inputParametersObj["cloud_provider"] &&
          offering?.productTierType !==
            productTierTypes.OMNISTRATE_MULTI_TENANCY &&
          offering?.supportsPublicNetwork;

        if (!data.network_type) {
          delete data.network_type;
        }

        if (!data.cloudProvider && inputParametersObj["cloud_provider"]) {
          return snackbar.showError("Cloud Provider is required");
        } else if (!data.region && inputParametersObj["region"]) {
          return snackbar.showError("Region is required");
        } else if (!data.network_type && networkTypeFieldExists) {
          return snackbar.showError("Network Type is required");
        }

        if (
          inputParametersObj["custom_dns_configuration"] &&
          data.requestParams["custom_dns_configuration"]
        ) {
          data.requestParams.custom_dns_configuration = {
            [selectedResource?.urlKey || ""]:
              data.requestParams.custom_dns_configuration,
          };
        }

        for (const field of requiredFields) {
          if (data.requestParams[field.key] === undefined) {
            snackbar.showError(`${field.displayName || field.key} is required`);
            return;
          }
        }

        if (!isTypeError) {
          createInstanceMutation.mutate(data);
        }
      } else {
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
          const result = schema.find((schemaParam) => {
            return schemaParam.key === key;
          });

          switch (result?.type?.toLowerCase()) {
            case "number":
              data.requestParams[key] = Number(data.requestParams[key]);
              break;
            case "float64":
              const output = Number(data.requestParams[key]);
              if (!Number.isNaN(output)) {
                data.requestParams[key] = Number(data.requestParams[key]);
              } else {
                snackbar.showError(`Invalid data in ${key}`);
                isTypeError = true;
              }
              break;
            case "boolean":
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
        const requiredFields = schema
          .filter((field) => !["cloud_provider", "region"].includes(field.key))
          .filter((schemaParam) => schemaParam.required);

        for (const field of requiredFields) {
          if (data.requestParams[field.key] === undefined) {
            snackbar.showError(`${field.displayName || field.key} is required`);
            return;
          }
        }

        if (!isTypeError) {
          updateResourceInstanceMutation.mutate({
            requestParams: data.requestParams,
          });
        }
      }
    },
  });

  const { values } = formData;
  const offering =
    serviceOfferingsObj[values.serviceId]?.[values.servicePlanId];

  const {
    data: resourceSchema = {} as APIEntity,
    isFetching: isFetchingResourceSchema,
  } = useResourceSchema({
    serviceId: values.serviceId,
    resourceId:
      offering?.resourceParameters.find(
        (resource) => resource.resourceId === values.resourceId
      )?.resourceId && values.resourceId,
    instanceId: selectedInstance?.id,
  });

  const {
    data: customAvailabilityZoneData,
    isLoading: isFetchingCustomAvailabilityZones,
  } = useAvailabilityZone(
    values.region,
    values.cloudProvider as CloudProvider,
    // @ts-ignore
    values.requestParams?.custom_availability_zone !== undefined
  );

  const {
    isFetching: isFetchingResourceInstanceIds,
    data: resourceIdInstancesHashMap = {},
  } = useResourcesInstanceIds(
    offering?.serviceProviderId,
    offering?.serviceURLKey,
    offering?.serviceAPIVersion,
    offering?.serviceEnvironmentURLKey,
    offering?.serviceModelURLKey,
    offering?.productTierURLKey,
    offering?.resourceParameters,
    subscriptionsObj[values.subscriptionId]?.productTierId ===
      values.servicePlanId && values.subscriptionId
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

      const isMultiTenancy =
        offering?.productTierType === productTierTypes.OMNISTRATE_MULTI_TENANCY;

      const networkTypeFieldExists =
        inputParameters.find((param) => param.key === "cloud_provider") &&
        !isMultiTenancy &&
        offering?.supportsPublicNetwork;

      if (networkTypeFieldExists) {
        formData.setFieldValue("network_type", "PUBLIC");
      } else {
        formData.setFieldValue("network_type", "");
      }
    }
  }, [resourceSchema, formMode]);

  const customAvailabilityZones = useMemo(() => {
    const availabilityZones =
      customAvailabilityZoneData?.availabilityZones || [];
    return availabilityZones.sort(function (a, b) {
      if (a.code < b.code) return -1;
      else if (a.code > b.code) {
        return 1;
      }
      return -1;
    });
  }, [customAvailabilityZoneData?.availabilityZones]);

  const cloudAccountInstances = useMemo(
    () =>
      instances
        .filter(
          // @ts-ignore
          (instance) => instance.result_params?.account_configuration_method
        )
        .filter((instance) => {
          if (instance.result_params?.gcp_project_id) {
            return values.cloudProvider === "gcp";
          } else if (instance.result_params?.aws_account_id) {
            return values.cloudProvider === "aws";
          }
        })
        .filter((instance) => ["READY", "RUNNING"].includes(instance.status))
        .map((instance) => ({
          ...instance,
          label: instance.result_params?.gcp_project_id
            ? `${instance.id} (Project ID - ${instance.result_params?.gcp_project_id})`
            : `${instance.id} (Account ID - ${instance.result_params?.aws_account_id})`,
        })),
    [instances, values.cloudProvider]
  );

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
      serviceOfferingsObj,
      customNetworks,
      isFetchingCustomNetworks
    );
  }, [formMode, formData.values, resourceSchema, serviceOfferingsObj]);

  const deploymentConfigurationFields = useMemo(() => {
    return getDeploymentConfigurationFields(
      formMode,
      formData.values,
      resourceSchema,
      resourceIdInstancesHashMap,
      isFetchingResourceInstanceIds,
      cloudAccountInstances
    );
  }, [
    formMode,
    formData.values,
    resourceSchema,
    resourceIdInstancesHashMap,
    cloudAccountInstances,
  ]);

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

  if (isFetchingServiceOfferings) {
    return <LoadingSpinner />;
  }

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
          top: "104px",
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

        <PreviewCard formData={formData} sections={sections} />

        <div
          style={{
            margin: "0px 16px 20px",
            paddingTop: "20px",
            borderTop: "1px solid #E9EAEB",
          }}
          className="flex items-center gap-3"
        >
          <Button
            data-testid="cancel-button"
            variant="outlined"
            onClick={() => setIsOverlayOpen(false)}
            disabled={
              createInstanceMutation.isLoading ||
              updateResourceInstanceMutation.isLoading
            }
            sx={{ marginLeft: "auto" }} // Pushes the 2 buttons to the end
          >
            Cancel
          </Button>

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
