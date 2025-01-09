"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Collapse, Tabs, Tab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Button from "components/Button/Button";
import Logs from "components/ResourceInstance/Logs/Logs";
import Backup from "components/ResourceInstance/Backup/Backup";
import Metrics from "components/ResourceInstance/Metrics/Metrics";
import AuditLogs from "components/ResourceInstance/AuditLogs/AuditLogs";
import NodesTable from "components/ResourceInstance/NodesTable/NodesTable";
import SubscriptionNotFoundUI from "components/Access/SubscriptionNotFoundUI";
import Connectivity from "components/ResourceInstance/Connectivity/Connectivity";
import ResourceInstanceDetails from "components/ResourceInstance/ResourceInstanceDetails/ResourceInstanceDetails";
import ResourceInstanceOverview from "components/ResourceInstance/ResourceInstanceOverview/ResourceInstanceOverview";

import { styleConfig } from "src/providerConfig";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import useResourceInstance from "src/hooks/useResourceInstance";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import {
  selectInstanceDetailsSummaryVisibility,
  toggleInstanceDetailsSummaryVisibility,
} from "src/slices/genericSlice";

import { getTabs } from "./utils";
import { DisplayText } from "src/components/Typography/Typography";
import { NetworkType } from "src/types/common/enums";
import useServiceOfferingResourceSchema from "src/hooks/useServiceOfferingResourceSchema";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import PageContainer from "app/(dashboard)/components/Layout/PageContainer";

type CurrentTab =
  | "Resource Instance Details"
  | "Connectivity"
  | "Nodes"
  | "Metrics"
  | "Logs"
  | "Events"
  | "Backups";

const isResourceBYOA = false;

const InstanceDetailsPage = ({
  params,
}: {
  params: {
    serviceId: string;
    servicePlanId: string;
    resourceId: string;
    instanceId: string;
    subscriptionId: string;
  };
}) => {
  const { serviceId, servicePlanId, resourceId, instanceId, subscriptionId } =
    params;

  const [currentTab, setCurrentTab] = useState<CurrentTab>(
    "Resource Instance Details"
  );

  const insightsVisible = useSelector(selectInstanceDetailsSummaryVisibility);
  const dispatch = useDispatch();

  const {
    subscriptions,
    serviceOfferingsObj,
    isFetchingServiceOfferings,
    isFetchingSubscriptions,
  } = useGlobalData();

  const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];

  const subscription = useMemo(() => {
    return subscriptions.find((sub) => sub.id === subscriptionId);
  }, [subscriptions, subscriptionId]);

  const { resourceName, resourceKey, resourceType } = useMemo(() => {
    const resource = offering?.resourceParameters.find(
      (resource) => resource.resourceId === resourceId
    );

    return {
      resourceName: resource?.name,
      resourceKey: resource?.urlKey,
      resourceType: resource?.type,
    };
  }, [offering, resourceId]);

  const isCliManagedResource = useMemo(
    () => CLI_MANAGED_RESOURCES.includes(resourceType),
    [resourceType]
  );

  const resourceInstanceQuery = useResourceInstance(
    offering?.serviceProviderId,
    offering?.serviceURLKey,
    offering?.serviceAPIVersion,
    offering?.serviceEnvironmentURLKey,
    offering?.serviceModelURLKey,
    offering?.productTierURLKey,
    resourceKey,
    instanceId,
    resourceId,
    subscription?.id
  );

  const { data: resourceInstanceData } = resourceInstanceQuery;

  const resourceSchemaQuery = useServiceOfferingResourceSchema(
    serviceId,
    resourceId,
    instanceId
  );

  const tabs = useMemo(
    () =>
      getTabs(
        resourceInstanceData?.isMetricsEnabled,
        resourceInstanceData?.isLogsEnabled,
        resourceInstanceData?.active,
        isResourceBYOA,
        isCliManagedResource,
        resourceType,
        resourceInstanceData?.backupStatus?.backupPeriodInHours
      ),
    [resourceInstanceData, isCliManagedResource, resourceType]
  );

  if (
    isFetchingServiceOfferings ||
    isFetchingSubscriptions ||
    resourceInstanceQuery.isLoading
  ) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (!subscription) {
    return (
      <PageContainer>
        <SubscriptionNotFoundUI />
      </PageContainer>
    );
  }

  if (!resourceInstanceData) {
    return (
      <PageContainer>
        <Stack p={3} pt="200px" alignItems="center" justifyContent="center">
          <DisplayText
            // @ts-ignore
            size="xsmall"
            sx={{ wordBreak: "break-word", textAlign: "center", maxWidth: 900 }}
          >
            Resource Instance not found
          </DisplayText>
        </Stack>
      </PageContainer>
    );
  }

  const queryData = {
    serviceProviderId: offering?.serviceProviderId,
    serviceKey: offering?.serviceURLKey,
    serviceAPIVersion: offering?.serviceAPIVersion,
    serviceEnvironmentKey: offering?.serviceEnvironmentURLKey,
    serviceModelKey: offering?.serviceModelURLKey,
    productTierKey: offering?.productTierURLKey,
    subscriptionId: subscription?.id,
    resourceInstanceId: instanceId,
    resourceKey: resourceKey,
  };

  let cloudProvider = resourceInstanceData?.cloudProvider;

  // The api doesn't return cloud provider field in the root object for a Cloud Provider Account instance
  // Get the cloud provider data from result parameters in this case
  if (!cloudProvider) {
    if (resourceInstanceData?.resultParameters?.cloud_provider) {
      cloudProvider = resourceInstanceData?.resultParameters?.cloud_provider;
    }
  }

  return (
    <PageContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link href="/instances">
          <Button
            startIcon={<RiArrowGoBackFill />}
            sx={{
              color: `${styleConfig.secondaryColor} !important`,
              "&:hover": {
                background: styleConfig.secondaryHoverLight,
              },
            }}
          >
            Back to list of Resource Instances
          </Button>
        </Link>
        <Button
          startIcon={
            insightsVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          }
          sx={{
            color: `${styleConfig.secondaryColor} !important`,
            "&:hover": {
              background: styleConfig.secondaryHoverLight,
            },
          }}
          onClick={() => dispatch(toggleInstanceDetailsSummaryVisibility())}
        >
          {insightsVisible ? "Hide Insights" : "View Insights"}
        </Button>
      </Stack>
      <Collapse in={insightsVisible}>
        <ResourceInstanceOverview
          resourceInstanceId={instanceId}
          region={resourceInstanceData.region}
          cloudProvider={cloudProvider}
          status={resourceInstanceData.status}
          createdAt={resourceInstanceData.createdAt}
          modifiedAt={resourceInstanceData.modifiedAt}
          networkType={resourceInstanceData.networkType}
          healthStatusPercent={resourceInstanceData.healthStatusPercent}
          isResourceBYOA={isResourceBYOA}
          isCliManagedResource={isCliManagedResource}
          subscriptionOwner={subscription.subscriptionOwnerName}
        />
      </Collapse>
      <Tabs
        value={currentTab}
        sx={{
          marginTop: "24px",
          borderBottom: "1px solid #E9EAEB",
        }}
      >
        {Object.entries(tabs).map(([key, value]) => {
          return (
            <Tab
              key={key}
              label={value}
              value={value}
              onClick={() => {
                setCurrentTab(value as CurrentTab);
              }}
              sx={{
                padding: "4px !important",
                marginRight: "16px",
                textTransform: "none",
                fontWeight: "600",
                color: "#717680",
              }}
            />
          );
        })}
      </Tabs>
      {currentTab === tabs.resourceInstanceDetails && (
        <ResourceInstanceDetails
          resourceInstanceId={instanceId}
          createdAt={resourceInstanceData.createdAt}
          modifiedAt={resourceInstanceData.modifiedAt}
          resultParameters={resourceInstanceData.resultParameters}
          isLoading={
            resourceSchemaQuery.isLoading || resourceInstanceQuery.isLoading
          }
          resultParametersSchema={
            resourceSchemaQuery?.data?.DESCRIBE?.outputParameters
          }
          serviceOffering={offering}
          subscriptionId={subscriptionId}
          customNetworkDetails={resourceInstanceData.customNetworkDetails}
          // cloudProviderAccountInstanceURL={cloudProviderAccountInstanceURL}
          // TODO: Check This
          resourceInstanceData={resourceInstanceData}
          autoscalingEnabled={resourceInstanceData.autoscalingEnabled}
          highAvailability={resourceInstanceData.highAvailability}
          backupStatus={resourceInstanceData.backupStatus}
          autoscaling={resourceInstanceData.autoscaling}
          serverlessEnabled={resourceInstanceData.serverlessEnabled}
        />
      )}
      {currentTab === tabs.connectivity && (
        <Connectivity
          networkType={resourceInstanceData.connectivity.networkType}
          clusterEndpoint={resourceInstanceData.connectivity.clusterEndpoint}
          nodeEndpoints={resourceInstanceData.connectivity.nodeEndpoints}
          ports={resourceInstanceData.connectivity.ports}
          availabilityZones={
            resourceInstanceData.connectivity.availabilityZones
          }
          publiclyAccessible={
            resourceInstanceData.connectivity.publiclyAccessible
          }
          privateNetworkCIDR={
            resourceInstanceData.connectivity.privateNetworkCIDR
          }
          privateNetworkId={resourceInstanceData.connectivity.privateNetworkId}
          globalEndpoints={resourceInstanceData.connectivity.globalEndpoints}
          nodes={resourceInstanceData.nodes}
          queryData={queryData}
          refetchInstance={resourceInstanceQuery.refetch}
          additionalEndpoints={
            resourceInstanceData.connectivity.additionalEndpoints
          }
        />
      )}
      {currentTab === tabs.nodes && (
        <NodesTable
          isAccessSide={true}
          resourceName={resourceName}
          nodes={resourceInstanceData.nodes}
          refetchData={resourceInstanceQuery.refetch}
          isRefetching={resourceInstanceQuery.isRefetching}
          serviceOffering={offering}
          resourceKey={resourceKey}
          resourceInstanceId={instanceId}
          subscriptionData={subscription}
          subscriptionId={subscription.id}
        />
      )}
      {currentTab === tabs.metrics && (
        <Metrics
          resourceInstanceId={instanceId}
          nodes={resourceInstanceData.nodes}
          socketBaseURL={resourceInstanceData.metricsSocketURL}
          instanceStatus={resourceInstanceData.status}
          resourceKey={resourceInstanceData.resourceKey}
          customMetrics={resourceInstanceData.customMetrics || []}
          mainResourceHasCompute={resourceInstanceData.mainResourceHasCompute}
          productTierType={offering.productTierType}
        />
      )}
      {currentTab === tabs.logs && (
        <Logs
          resourceInstanceId={instanceId}
          nodes={resourceInstanceData.nodes}
          socketBaseURL={resourceInstanceData.logsSocketURL}
          instanceStatus={resourceInstanceData.status}
          resourceKey={resourceInstanceData.resourceKey}
          mainResourceHasCompute={resourceInstanceData.mainResourceHasCompute}
        />
      )}

      {currentTab === tabs.auditLogs && (
        <AuditLogs
          instanceId={instanceId}
          subscriptionId={subscriptionId}
          serviceId={serviceId}
          productTierId={servicePlanId}
        />
      )}
      {currentTab === tabs.backups && (
        // @ts-ignore
        <Backup
          backupStatus={resourceInstanceData.backupStatus}
          instanceId={instanceId}
          accessQueryParams={queryData}
          resourceName={resourceName}
          networkType={
            (resourceInstanceData?.connectivity?.networkType
              ? resourceInstanceData?.connectivity?.networkType.toUpperCase()
              : "PUBLIC") as NetworkType
          }
        />
      )}
    </PageContainer>
  );
};

export default InstanceDetailsPage;
