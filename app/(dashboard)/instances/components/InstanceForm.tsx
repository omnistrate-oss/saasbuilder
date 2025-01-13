"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";
import {
  createResourceInstance,
  getResourceInstanceDetails,
  updateResourceInstance,
} from "src/api/resourceInstance";
import useSnackbar from "src/hooks/useSnackbar";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { getMainResourceFromInstance } from "../utils";
import { Text } from "src/components/Typography/Typography";
import useResourceSchema from "../hooks/useResourceSchema";
import useAvailabilityZone from "src/hooks/query/useAvailabilityZone";
import StandardInformationFields from "./StandardInformationFields";
import Form from "src/components/FormElementsv2/Form/Form";
import Button from "src/components/Button/Button";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import NetworkFields from "./NetworkFields";
import DeploymentConfigurationFields from "./DeploymentConfigurationFields";
import { colors } from "src/themeConfig";

const InstanceForm = ({
  formMode,
  onClose,
  selectedInstance,
  refetchInstances,
}) => {
  const snackbar = useSnackbar();
  const { subscriptions, serviceOfferings, serviceOfferingsObj } =
    useGlobalData();

  const selectedSubscription = useMemo(() => {
    return subscriptions.find(
      (sub) => sub.id === selectedInstance?.subscriptionId
    );
  }, [selectedInstance, subscriptions]);

  const createInstanceMutation = useMutation(
    async (payload: any) => {
      const { data } = await createResourceInstance(payload);
      const service =
        serviceOfferingsObj[payload.serviceId]?.[payload.servicePlanId]
          ?.offering;

      // Fetch the New Instance to Update the Query Data
      const instanceData = await getResourceInstanceDetails(
        payload.serviceProviderId,
        payload.serviceKey,
        payload.serviceAPIVersion,
        payload.serviceEnvironmentKey,
        payload.serviceModelKey,
        payload.productTierKey,
        payload.resourceKey,
        data.id,
        payload.subscriptionId
      );

      // This Data will be used to update the Query Data
      return {
        ...instanceData.data,
        serviceProviderId: payload.serviceProviderId,
        serviceURLKey: payload.serviceKey,
        serviceAPIVersion: payload.serviceAPIVersion,
        serviceEnvironmentURLKey: payload.serviceEnvironmentKey,
        serviceModelURLKey: payload.serviceModelKey,
        productTierURLKey: payload.productTierKey,
        resourceKey: payload.resourceKey,
        instanceId: data.id,
        subscriptionId: payload.subscriptionId,
        serviceId: service?.serviceId,
        serviceEnvironmentID: service?.serviceEnvironmentID,
        productTierID: service?.productTierID,
      };
    },
    {
      onSuccess: (res) => {
        snackbar.showSuccess("Instance created successfully");
        // TODO
        // queryClient.setQueryData(["resourceInstances"], (oldData: any) => {
        //   return [res, ...oldData];
        // });
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
      resourceId: getMainResourceFromInstance(selectedInstance)?.id || "",
      cloudProvider: selectedInstance?.cloudProvider || "",
      region: selectedInstance?.region || "",
      networkType: "",
      requestParams: {
        ...(selectedInstance?.result_params || {}),
      },
    },
    onSubmit: (values) => {
      if (formMode === "create") {
        createInstanceMutation.mutate(values);
      } else {
        updateResourceInstanceMutation.mutate(values);
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

      // Default Value for Boolean Fields are Sent as a String
      if (param.type === "Boolean" && param.defaultValue) {
        acc[param.key] = param.defaultValue === "true";
      }
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

  return (
    // @ts-ignore
    <Form className="flex items-start gap-8" onSubmit={formData.handleSubmit}>
      <div style={{ flex: 5 }} className="space-y-6">
        <StandardInformationFields
          formData={formData}
          formMode={formMode}
          customAvailabilityZones={customAvailabilityZones}
          isFetchingCustomAvailabilityZones={isFetchingCustomAvailabilityZones}
          resourceSchema={resourceSchema}
          isFetchingResourceSchema={isFetchingResourceSchema}
        />
        <NetworkFields
          formData={formData}
          formMode={formMode}
          resourceSchema={resourceSchema}
          isFetchingResourceSchema={isFetchingResourceSchema}
        />
        <DeploymentConfigurationFields
          formData={formData}
          formMode={formMode}
          resourceSchema={resourceSchema}
          isFetchingResourceSchema={isFetchingResourceSchema}
        />
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
          {/* {sections.map((section, index) => {
            return (
              <div key={index}>
                <Text
                  size="small"
                  weight="semibold"
                  color={styleConfig.primaryColor}
                  sx={{ mb: "10px" }}
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
                                color="#181D27"
                              >

                                {formData.values[field.name]} // TODO: Fix the Ellipses Overflow Issue
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
          })} */}
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
