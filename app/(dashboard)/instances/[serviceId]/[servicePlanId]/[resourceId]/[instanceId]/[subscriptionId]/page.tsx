"use client";

import Link from "next/link";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Collapse } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "components/Button/Button";
import Logs from "components/ResourceInstance/Logs/Logs";
import Backup from "components/ResourceInstance/Backup/Backup";
import { DisplayText } from "components/Typography/Typography";
import Metrics from "components/ResourceInstance/Metrics/Metrics";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import AuditLogs from "components/ResourceInstance/AuditLogs/AuditLogs";
import NodesTable from "components/ResourceInstance/NodesTable/NodesTable";
import SubscriptionNotFoundUI from "components/Access/SubscriptionNotFoundUI";
import Connectivity from "components/ResourceInstance/Connectivity/Connectivity";
import ResourceInstanceDetails from "components/ResourceInstance/ResourceInstanceDetails/ResourceInstanceDetails";
import ResourceInstanceOverview from "components/ResourceInstance/ResourceInstanceOverview/ResourceInstanceOverview";
import { NetworkType } from "src/types/common/enums";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import useResourceInstance from "src/hooks/useResourceInstance";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import useServiceOfferingResourceSchema from "src/hooks/useServiceOfferingResourceSchema";
import {
  selectInstanceDetailsSummaryVisibility,
  toggleInstanceDetailsSummaryVisibility,
} from "src/slices/genericSlice";
import { checkCustomDNSEndpoint, getTabs } from "./utils";
import PageContainer from "app/(dashboard)/components/Layout/PageContainer";
import ResourceCustomDNS from "src/components/ResourceInstance/Connectivity/ResourceCustomDNS";
import { useSearchParams } from "next/navigation";
import { Tab, Tabs } from "src/components/Tab/Tab";

export type CurrentTab =
  | "Instance Details"
  | "Connectivity"
  | "Nodes"
  | "Metrics"
  | "Logs"
  | "Events"
  | "Backups"
  | "Custom DNS";

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
  const searchParams = useSearchParams();
  const view = searchParams?.get("view");

  const [currentTab, setCurrentTab] = useState<CurrentTab>("Instance Details");

  // Set Page Title
  useEffect(() => {
    document.title = currentTab;
  }, [currentTab]);

  useEffect(() => {
    if (view) {
      setCurrentTab(view as CurrentTab);
    }
  }, [view]);

  const insightsVisible = useSelector(selectInstanceDetailsSummaryVisibility);
  const dispatch = useDispatch();

  const {
    subscriptionsObj,
    serviceOfferingsObj,
    isFetchingServiceOfferings,
    isFetchingSubscriptions,
  } = useGlobalData();

  const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
  const subscription = subscriptionsObj[subscriptionId];

  const { resourceName, resourceKey, resourceType } = useMemo(() => {
    const resource = offering?.resourceParameters.find(
      (resource) => resource.resourceId === resourceId
    );

    return {
      resourceName: resource?.name,
      resourceKey: resource?.urlKey,
      resourceType: resource?.resourceType,
    };
  }, [offering, resourceId]);

  const isCliManagedResource = useMemo(
    () => CLI_MANAGED_RESOURCES.includes(resourceType as string),
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
        resourceInstanceData?.backupStatus?.backupPeriodInHours,
        checkCustomDNSEndpoint(
          resourceInstanceData
            ? resourceInstanceData?.connectivity?.globalEndpoints
            : {}
        )
      ),
    [resourceInstanceData, isCliManagedResource, resourceType]
  );

  if (
    !isFetchingServiceOfferings &&
    !isFetchingSubscriptions &&
    (!subscription || !offering)
  ) {
    return (
      <PageContainer>
        <SubscriptionNotFoundUI isOfferingFound={!!offering} />
      </PageContainer>
    );
  }

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
    serviceProviderId: offering.serviceProviderId,
    serviceKey: offering.serviceURLKey,
    serviceAPIVersion: offering.serviceAPIVersion,
    serviceEnvironmentKey: offering.serviceEnvironmentURLKey,
    serviceModelKey: offering.serviceModelURLKey,
    productTierKey: offering.productTierURLKey,
    subscriptionId: subscription.id,
    resourceInstanceId: instanceId,
    resourceKey: resourceKey,
  };

  let cloudProvider = resourceInstanceData?.cloudProvider;

  // The api doesn't return cloud provider field in the root object for a Cloud Provider Account instance
  // Get the cloud provider data from result parameters in this case
  if (!cloudProvider) {
    // @ts-ignore
    if (resourceInstanceData?.resultParameters?.cloud_provider) {
      // @ts-ignore
      cloudProvider = resourceInstanceData?.resultParameters?.cloud_provider;
    }
  }

  return (
    <PageContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link href="/instances">
          <Button startIcon={<RiArrowGoBackFill />}>
            Back to list of Deployment Instances
          </Button>
        </Link>
        <Button
          endIcon={
            insightsVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          }
          onClick={() => dispatch(toggleInstanceDetailsSummaryVisibility())}
        >
          {insightsVisible ? "Hide Summary" : "Show Summary"}
        </Button>
      </Stack>
      <Collapse in={insightsVisible}>
        <ResourceInstanceOverview
          serviceName={subscription?.serviceName}
          productTierName={subscription?.productTierName}
          serviceLogoURL={subscription?.serviceLogoURL}
          resourceInstanceId={instanceId}
          region={resourceInstanceData.region}
          cloudProvider={cloudProvider}
          status={resourceInstanceData.status}
          createdAt={resourceInstanceData.createdAt}
          modifiedAt={resourceInstanceData.modifiedAt}
          isCliManagedResource={isCliManagedResource}
          subscriptionOwner={subscription.subscriptionOwnerName}
          detailedNetworkTopology={
            resourceInstanceData.detailedNetworkTopology || {}
          }
          onViewNodesClick={() => {
            setCurrentTab("Nodes");
          }}
        />
      </Collapse>
      <Tabs
        value={currentTab}
        sx={{ marginTop: "20px" }}
        // sx={{
        //   marginTop: "24px",
        //   borderBottom: "1px solid #E9EAEB",
        //   "& .MuiTabs-indicator": {
        //     backgroundColor: colors.purple700,
        //   },
        // }}
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
              disableRipple
              // sx={{
              //   minWidth: "0px",
              //   textTransform: "none",
              //   fontWeight: "600",
              //   color: "#717680",
              //   "&.Mui-selected": {
              //     color: colors.purple800,
              //   },
              // }}
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
          cloudProviderAccountInstanceURL="/cloud-accounts"
          resourceInstanceData={resourceInstanceData}
          autoscalingEnabled={resourceInstanceData.autoscalingEnabled}
          highAvailability={resourceInstanceData.highAvailability}
          backupStatus={resourceInstanceData.backupStatus}
          autoscaling={resourceInstanceData.autoscaling}
          serverlessEnabled={resourceInstanceData.serverlessEnabled}
          isCliManagedResource={isCliManagedResource}
          licenseDetails={resourceInstanceData?.subscriptionLicense}
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
          isLoading={resourceInstanceQuery.isLoading}
          serviceOffering={offering}
          resourceKey={resourceKey}
          resourceInstanceId={instanceId}
          subscriptionData={subscription}
          subscriptionId={subscription.id}
          isBYOAServicePlan={offering?.serviceModelType === "BYOA"}
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
        <AuditLogs instanceId={instanceId} subscriptionId={subscriptionId} />
      )}
      {currentTab === tabs.backups && (
        <Backup
          // @ts-ignore
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
      {currentTab === tabs.customDNS && (
        <ResourceCustomDNS
          globalEndpoints={resourceInstanceData.connectivity.globalEndpoints}
          context="access"
          accessQueryParams={queryData}
          refetchInstance={resourceInstanceQuery.refetch}
        />
      )}
    </PageContainer>
  );
};

export default InstanceDetailsPage;
