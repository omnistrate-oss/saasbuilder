import { Box, CircularProgress, Collapse, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import marketplaceIcon from "../../../public/assets/images/dashboard/marketplace.svg";
import marketplaceReturnIcon from "../../../public/assets/images/dashboard/marketplaceIcon.svg";
import {
  deleteResourceInstance,
  getResourceInstanceDetails,
  getResourceInstanceIds,
  getTerraformKit,
  createResourceInstance,
  restartResourceInstance,
  startResourceInstance,
  stopResourceInstance,
  updateResourceInstance,
} from "../../../src/api/resourceInstance";
import { describeServiceOfferingResource } from "../../../src/api/serviceOffering";
import Card from "../../../src/components/Card/Card";
import DashboardLayout from "../../../src/components/DashboardLayout/DashboardLayout";
import DataGrid, {
  selectSingleItem,
} from "../../../src/components/DataGrid/DataGrid";
import ConfirmationDialog from "../../../src/components/Dialog/ConfirmDialog";
import CreateResourceInstanceForm from "../../../src/components/Forms/CreateResourceInstanceForm";
import GridCellExpand from "../../../src/components/GridCellExpand/GridCellExpand";
import LogoHeader from "../../../src/components/Headers/LogoHeader";
import AwsCloudIcon from "../../../public/assets/images/logos/awsCloud.svg";
import GcpCloudIcon from "../../../public/assets/images/logos/gcpCloud.svg";
import AwsLogo from "../../../src/components/Logos/AwsLogo/AwsLogo";
import AzureLogo from "../../../src/components/Logos/AzureLogo/AzureLogo";
import GcpLogo from "../../../src/components/Logos/GcpLogo/GcpLogo";
import ResourceInfoView from "../../../src/components/Marketplace/ResourceInfoView";
import ResourceUpdateView from "../../../src/components/Marketplace/ResourceUpdateView";
import RegionIcon from "../../../src/components/Region/RegionIcon";
import SideDrawerRight from "../../../src/components/SideDrawerRight/SideDrawerRight";
import StatusChip from "../../../src/components/StatusChip/StatusChip";
import { Text } from "../../../src/components/Typography/Typography";
import useServiceOffering from "../../../src/hooks/useServiceOffering";
import useSnackbar from "../../../src/hooks/useSnackbar";
import {
  selectResourceInstanceList,
  selectResourceInstanceListLoadingStatus,
  setResourceInstanceList,
  setResourceInstanceListLoadingStatus,
  setResourceInstanceListToEmpty,
} from "../../../src/slices/resourceInstanceListSlice";
import loadingStatuses from "../../../src/utils/constants/loadingStatuses";
import formatDateUTC from "../../../src/utils/formatDateUTC";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import AccessHeaderCard from "src/components/AccessHeader/AccessHeaderCard";
import { AccessSupport } from "src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
  getResourceInstancesDetailsRoute,
} from "../../../src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import CloudProviderAccountOrgIdModal from "src/components/CloudProviderAccountOrgIdModal/CloudProviderAccountOrgIdModal";
import {
  getAwsBootstrapArn,
  getGcpServiceEmail,
} from "src/utils/accountConfig/accountConfig";
import GradientProgressBar from "src/components/GradientProgessBar/GradientProgressBar";
import { ACCOUNT_CREATION_METHODS } from "src/utils/constants/accountConfig";
import Tooltip from "src/components/Tooltip/Tooltip";
import ViewInstructionsIcon from "src/components/Icons/AccountConfig/ViewInstrcutionsIcon";
import DeleteAccountConfigConfirmationDialog from "src/components/DeleteAccountConfigConfirmationDialog/DeleteAccountConfigConfirmationDialog";
import { selectUserrootData } from "src/slices/userDataSlice";
import { cloneDeep } from "lodash";
import { calculateInstanceHealthPercentage } from "src/utils/instanceHealthPercentage";
import AccessServiceHealthStatus from "src/components/ServiceHealthStatus/AccessServiceHealthStatus";
import AccessSideRestoreInstance from "src/components/RestoreInstance/AccessSideRestoreInstance";
import DataGridText from "src/components/DataGrid/DataGridText";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import CustomNetworks from "src/features/CustomNetworks/CustomNetworks";
import CapacityDialog from "src/components/CapacityDialog/CapacityDialog";
import InstancesTableHeader from "src/features/ResourceInstance/components/InstancesTableHeader";
import { CLOUD_PROVIDERS } from "src/constants/cloudProviders";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import SpeedoMeterLow from "../../../public/assets/images/dashboard/resource-instance-speedo-meter/idle.png";
import SpeedoMeterMedium from "../../../public/assets/images/dashboard/resource-instance-speedo-meter/normal.png";
import SpeedoMeterHigh from "../../../public/assets/images/dashboard/resource-instance-speedo-meter/high.png";
import DashboardHeaderIcon from "src/components/Icons/Dashboard/DashboardHeaderIcon";
import { productTierTypes } from "src/constants/servicePlan";
import Button from "src/components/Button/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styleConfig } from "src/providerConfig";
import {
  selectInstanceListSummaryVisibility,
  toggleInstanceListSummaryVisibility,
} from "src/slices/genericSlice";
import CreateResourceInstanceModel from "src/components/ResourceInstance/CreateResourceInstanceModel/CreateResourceInstanceModel";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function MarketplaceService() {
  const [selectionModel, setSelectionModel] = useState([]);
  const [viewResourceInfo, setViewResourceInfo] = useState({});
  const resourceInstanceList = useSelector(selectResourceInstanceList);
  const [currentSource, setCurrentSource] = React.useState("");
  const [cloudProviderAccounts, setCloudProviderAccounts] = useState([]);
  const [cloudProviderResource, setCloudProviderResource] = useState(null);
  const [searchText, setSearchText] = useState(""); // Data Grid Search Field Text
  const [isRestoreInstanceModalOpen, setIsResourceInstanceModalOpen] =
    useState(false);

  const [isOrgIdModalOpen, setIsOrgIdModalOpen] = useState(false);
  const [isInstanceIdModalOpen, setIsInstanceIdModalOpen] = useState(false);
  const [isCustomDNS, setIsCustomDNS] = useState(false);
  const [instanceId, setInstanceId] = useState("");

  //this is required to show some extra text on CloudProviderAccountModal on creation
  const [isAccountCreation, setIsAccountCreation] = useState(false);
  const [accountConfigMethod, setAccountConfigMethod] = useState(); // CloudFormation or Terraform
  const [cloudProvider, setCloudProvider] = useState("");
  const [cloudFormationTemplateUrl, setCloudFormationTemplateUrl] =
    useState("");
  const [cloudFormationTemplateUrlNoLB, setCloudFormationTemplateUrlNoLB] =
    useState("");
  const [accountConfigStatus, setAccountConfigStatus] = useState("");
  const [accountConfigId, setAccountConfigId] = useState("");
  //this is required to show some extra text on CloudProviderAccountModal on creation
  const [showCapacityDialog, setShowCapacityDialog] = useState(false);
  const [currentCapacityAction, setCurrentCapacityAction] = useState("add");

  const [isCreateInstanceSchemaFetching, setIsCreateInstanceSchemaFetching] =
    useState(false);

  function handleOrgIdModalOpen() {
    setIsOrgIdModalOpen(true);
  }

  function handleOrgIdModalClose() {
    setIsOrgIdModalOpen(false);
  }

  function handleInstanceIdModalClose() {
    setIsInstanceIdModalOpen(false);
  }

  const handleRestoreInstanceModalOpen = () => {
    setIsResourceInstanceModalOpen(true);
  };

  const handleRestoreInstanceModalClose = () => {
    setIsResourceInstanceModalOpen(false);
  };
  const filteredInstances = useMemo(() => {
    if (!resourceInstanceList?.length) {
      return [];
    }

    if (searchText) {
      return resourceInstanceList.filter((instance) =>
        instance?.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return resourceInstanceList;
  }, [resourceInstanceList, searchText]);
  const resourceInstancesHashmap = useMemo(() => {
    const hashmap = {};
    resourceInstanceList.forEach((instance) => {
      hashmap[instance.id] = instance;
    });
    return hashmap;
  }, [resourceInstanceList]);

  const [selectedResourceInstances, setSelectedResourceInstances] = useState(
    []
  );

  const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
  const [requestParams, setRequestParams] = useState({});
  const [selectedResource, setSelectedResource] = useState({
    key: "",
    id: "",
    name: "",
    isDeprecated: false,
    isBackupEnabled: false,
    resourceType: "",
  });

  let isCurrentResourceBYOA = false;
  if (
    selectedResource?.id &&
    selectedResource.id.includes("r-injectedaccountconfig")
  )
    isCurrentResourceBYOA = true;
  const selectedUser = useSelector(selectUserrootData);
  const isUnmounted = useRef(false);
  const router = useRouter();
  const {
    serviceId,
    source,
    productTierId,
    resourceId,
    subscriptionId,
    viewType,
  } = router.query;
  const {
    data: service,
    status: servicesLoadingStatus,
    isLoading: isServiceLoading,
  } = useServiceOffering(serviceId, productTierId);

  const maxNumberOfInstancesReached = useMemo(() => {
    if (!service || !resourceInstanceList || !service.billingPlans) {
      return false;
    }

    // Count Instances that are not in FAILED, DELETING, DELETED status
    const instancesToCount = resourceInstanceList.filter(
      (el) => !["FAILED", "DELETING", "DELETED"].includes(el.status)
    );

    return (
      instancesToCount.length >= service.billingPlans?.[0]?.maxNumberofInstances
    );
  }, [resourceInstanceList, service]);

  const environmentId = service?.serviceEnvironmentID;

  const [creationDrawerOpen, setCreationDrawerOpen] = useState(false);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [viewInfoDrawerOpen, setViewInfoDrawerOpen] = useState(false);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [viewInstructionsItem, setViewInstructionsItem] = useState(null);
  const insightsVisible = useSelector(selectInstanceListSummaryVisibility);

  const timeoutID = useRef(null);
  const currentResourceInfo = useRef({ resourceKey: null, resourceId: null });
  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  //set Cloud Formation URLS from the service offering API response
  useEffect(() => {
    if (service?.assets?.cloudFormationURL) {
      setCloudFormationTemplateUrl(service.assets.cloudFormationURL);
    }
    if (service?.assets?.cloudFormationURLNoLB) {
      setCloudFormationTemplateUrlNoLB(service.assets.cloudFormationURLNoLB);
    }
  }, [service]);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const {
    data: subscriptionData = {},
    isLoading: isLoadingSubscription,
    isFetched: isSubscriptionDataFetched,
  } = subscriptionQuery;

  const isCustomNetworkEnabled = useMemo(() => {
    let enabled = false;

    if (
      service?.serviceModelFeatures?.find((featureObj) => {
        return featureObj.feature === "CUSTOM_NETWORKS";
      })
    )
      enabled = true;

    return enabled;
  }, [service]);

  const shouldShowKubernetesDashboardColumn = resourceInstanceList?.some(
    (instance) => instance.kubernetesDashboardEndpoint
  );

  const isMultiTenancy = useMemo(
    () =>
      service?.productTierType === productTierTypes.OMNISTRATE_MULTI_TENANCY,

    [service]
  );

  const handleViewAccountConfigInstructions = (row) => {
    setViewInstructionsItem(row);
    const result_params = row.result_params;
    setCloudProvider(
      result_params?.cloud_provider === CLOUD_PROVIDERS.aws ||
        !!result_params?.aws_account_id
        ? "aws"
        : "gcp"
    );
    setAccountConfigMethod(result_params?.account_configuration_method);
    handleOrgIdModalOpen();
  };

  const columns = useMemo(() => {
    const columnDefinition = [
      {
        field: "id",
        headerName: "ID",
        flex: 0.9,
        minWidth: 200,
        valueGetter: (params) => {
          return isCurrentResourceBYOA
            ? "account-" + params.row.id
            : params.row.id;
        },
        renderCell: (params) => {
          const instanceId = params.row.id;
          const instanceIdDisplay = isCurrentResourceBYOA
            ? "account-" + instanceId
            : instanceId;

          const resourceInstanceUrlLink = getResourceInstancesDetailsRoute(
            serviceId,
            environmentId,
            productTierId,
            selectedResource?.id,
            instanceId,
            subscriptionData?.id
          );

          return (
            <DataGridText
              color="primary"
              showCopyButton
              linkProps={{
                href: resourceInstanceUrlLink,
              }}
            >
              {instanceIdDisplay}
            </DataGridText>
          );
        },
      },
      {
        field: "resourceName",
        headerName: "Resource Name",
        flex: 1,
        minWidth: 235,
        valueGetter: () => selectedResource?.name,
      },
      {
        field: "status",
        headerName: "Lifecycle Status",
        flex: 0.9,
        minWidth: 160,
        renderCell: (params) => {
          const status = params.row.status;
          const showInstructions =
            isCurrentResourceBYOA &&
            [
              "VERIFYING",
              "PENDING",
              "PENDING_DEPENDENCY",
              "UNKNOWN",
              "DEPLOYING",
              "READY",
              "FAILED",
            ].includes(status);
          const statusSytlesAndLabel =
            getResourceInstanceStatusStylesAndLabel(status);
          return (
            <Stack
              direction="row"
              alignItems="center"
              gap="6px"
              minWidth="94px"
              justifyContent="space-between"
            >
              <StatusChip status={status} {...statusSytlesAndLabel} />
              {showInstructions && (
                <Tooltip
                  title={
                    <Text sx={{ padding: "4px", color: "white" }}>
                      click here to view account <br /> configuration
                      instructions
                    </Text>
                  }
                  placement="top-start"
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      handleViewAccountConfigInstructions(params.row);
                    }}
                  >
                    <ViewInstructionsIcon />
                  </Box>
                </Tooltip>
              )}
            </Stack>
          );
        },
      },
      {
        field: "instanceLoadStatus",
        headerName: "Load",
        flex: 0.9,
        minWidth: 100,
        renderCell: (params) => {
          const instanceLoadStatus = params.row.instanceLoadStatus;

          return (
            <Stack direction={"row"} alignItems={"center"} gap="4px">
              {instanceLoadStatus === "UNKNOWN" && "-"}
              {instanceLoadStatus === "POD_IDLE" && (
                <Image
                  src={SpeedoMeterLow}
                  width={54}
                  height={54}
                  alt="Low"
                  style={{ marginBottom: "-25px" }}
                />
              )}
              {instanceLoadStatus === "POD_NORMAL" && (
                <Image
                  src={SpeedoMeterMedium}
                  width={54}
                  height={54}
                  alt="Medium"
                  style={{ marginBottom: "-25px" }}
                />
              )}
              {instanceLoadStatus === "POD_OVERLOAD" && (
                <Image
                  src={SpeedoMeterHigh}
                  width={54}
                  height={54}
                  alt="High"
                  style={{ marginBottom: "-25px" }}
                />
              )}
            </Stack>
          );
        },
      },
      {
        field: "created_at",
        headerName: "Created On",
        flex: 1,
        minWidth: 235,
        valueGetter: (params) => {
          const value = formatDateUTC(params.row.created_at);
          return value;
        },
      },
      {
        field: "last_modified_at",
        headerName: "Last Modified",
        flex: 1,
        minWidth: 225,
        valueGetter: (params) => {
          const value = formatDateUTC(params.row.last_modified_at);
          return value;
        },
      },
      {
        field: "region",
        headerName: "Region",
        flex: 1,
        minWidth: 155,
        renderCell: (params) => {
          const region = params.row.region;
          return (
            <GridCellExpand
              value={region || "Global"}
              startIcon={<RegionIcon />}
            />
          );
        },
      },
    ];

    if (service?.productTierType !== productTierTypes.CUSTOM_TENANCY) {
      columnDefinition.push({
        field: "healthStatus",
        headerName: "Health Status",
        flex: 1,
        minWidth: 200,
        valueGetter: (params) => {
          const status = params.row.status;
          let mainResource = [];
          if (params.row?.detailedNetworkTopology) {
            const detailedNetworkTopologyEntries = Object.entries(
              params.row?.detailedNetworkTopology ?? {}
            );

            mainResource = detailedNetworkTopologyEntries?.find(
              ([, details]) => {
                return details.main === true;
              }
            );
          }
          const [, topologyDetails] = mainResource ?? [];

          if (CLI_MANAGED_RESOURCES.includes(topologyDetails?.resourceType))
            return "Unknown";

          if (status === "STOPPED") return "N/A";

          const healthPercentage = calculateInstanceHealthPercentage(
            params.row.detailedNetworkTopology,
            status
          );

          return healthPercentage;
        },
        renderCell: (params) => {
          if (params.value === "Unknown")
            return <StatusChip category="unknown" label="Unknown" />;

          if (params.value === "N/A")
            return <StatusChip category="unknown" label="N/A" />;

          return <GradientProgressBar percentage={params.value} />;
        },
      });
    }

    // If a resource is BYOA, one of the fields: awsAccountId, gcpProjectID are present for all the instances
    // If present, add a column at the 1st index. Otherwise add a column at the 4th index.
    if (
      resourceInstanceList[0]?.awsAccountId ||
      resourceInstanceList[0]?.gcpProjectID
    ) {
      columnDefinition.splice(1, 0, {
        field: "cloud_provider",
        headerName: "Account ID",
        flex: 0.8,
        valueGetter: (params) =>
          params.row.awsAccountId || params.row.gcpProjectID,
        renderCell: (params) => {
          let Logo;
          const provider = params.row.cloud_provider;
          const id = params.row.awsAccountId || params.row.gcpProjectID;
          if (provider === "aws") {
            Logo = AwsCloudIcon;
          } else {
            Logo = GcpCloudIcon;
          }

          return <AccountConfigCell logo={Logo} id={id} />;
        },
      });
    } else {
      columnDefinition.splice(4, 0, {
        field: "cloud_provider",
        headerName: "☁️ Provider(s)",
        flex: 0.8,
        minWidth: 130,
        valueGetter: (params) => {
          const cloudProvider = isCurrentResourceBYOA
            ? params.row.result_params?.cloud_provider
            : params.row.cloud_provider;

          return cloudProvider;
        },
        renderCell: (params) => {
          const cloudProvider = params.value;

          return cloudProvider === "aws" ? (
            <AwsLogo />
          ) : cloudProvider === "gcp" ? (
            <GcpLogo />
          ) : cloudProvider === "azure" ? (
            <AzureLogo />
          ) : (
            "-"
          );
        },
      });
    }

    if (shouldShowKubernetesDashboardColumn) {
      columnDefinition.push({
        field: "kubernetesDashboardEndpoint",
        headerName: "Dashboard Endpoint",
        flex: 1,
        minWidth: 150,
        valueGetter: (params) =>
          params.row.kubernetesDashboardEndpoint?.dashboardEndpoint || "-",
        renderCell: (params) => {
          const { row } = params;
          const dashboardEndpoint =
            row.kubernetesDashboardEndpoint?.dashboardEndpoint;

          if (!dashboardEndpoint) {
            return "-";
          }

          return (
            <GridCellExpand
              value={dashboardEndpoint}
              href={"https://" + dashboardEndpoint}
              target="_blank"
              externalLinkArrow
            />
          );
        },
      });
    }

    return columnDefinition;
  }, [
    serviceId,
    service,
    selectedResource,
    resourceInstanceList,
    environmentId,
    isCurrentResourceBYOA,
    subscriptionData?.id,
    productTierId,
    shouldShowKubernetesDashboardColumn,
  ]);

  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  const handleConfirmationClose = () => {
    setIsConfirmationDialog(false);
  };
  let selectedResourceInstance = null;

  const loadingStatus = useSelector(selectResourceInstanceListLoadingStatus);
  const isLoading = loadingStatus === loadingStatuses.loading;
  const deleteformik = useFormik({
    initialValues: {
      deleteme: "",
    },
    onSubmit: (values) => {
      if (values.deleteme === "deleteme") {
        /*eslint-disable-next-line no-use-before-define*/
        deleteResourceInstanceMutation.mutate();
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const deleteResourceInstanceMutation = useMutation(
    async () => {
      const instanceDeletePromises = selectedResourceInstances.map(
        (instance) => {
          const requestPayload = {
            serviceProviderId: service.serviceProviderId,
            serviceKey: service.serviceURLKey,
            serviceAPIVersion: service.serviceAPIVersion,
            serviceEnvironmentKey: service.serviceEnvironmentURLKey,
            serviceModelKey: service.serviceModelURLKey,
            productTierKey: service.productTierURLKey,
            resourceKey: selectedResource.key,
            id: instance.id,
            subscriptionId: subscriptionData?.id,
          };

          return deleteResourceInstance(requestPayload);
        }
      );

      return Promise.allSettled(instanceDeletePromises);
    },
    {
      onSuccess: async () => {
        if (selectedResource?.id.includes("r-injectedaccountconfig")) {
          snackbar.showSuccess("Deleting Cloud Provider Account");
        } else {
          snackbar.showSuccess("Deleting Resource Instance");
        }
        setSelectionModel([]);
        fetchResourceInstances(selectedResource);
        deleteformik.resetForm();
        setCreationDrawerOpen(false);
        setViewInfoDrawerOpen(false);
        setIsConfirmationDialog(false);
      },
      onError: () => {
        deleteformik.resetForm();
      },
    }
  );

  const downloadTerraformKitMutation = useMutation(
    () => {
      if (service && subscriptionData) {
        return getTerraformKit(
          service.serviceProviderId,
          service.serviceURLKey,
          service.serviceAPIVersion,
          service.serviceEnvironmentURLKey,
          service.serviceModelURLKey,
          subscriptionData?.id,
          cloudProvider
        );
      }
    },
    {
      onSuccess: (response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "terraformkit.tar");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      },
    }
  );

  const openCreationDrawer = () => {
    if (cloudProviderResource) {
      fetchCloudProviderResourceInstances(cloudProviderResource);
    }
    setCreationDrawerOpen(true);
  };

  const openUpdateDrawer = () => {
    if (selectedResourceInstance.id == null) {
      setIsConfirmationDialog(false);
      snackbar.showError("Select a resource to modify");
    } else {
      setUpdateDrawerOpen(true);
    }
  };

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  const openViewInfoDrawer = () => {
    setViewInfoDrawerOpen(true);
  };

  const closeViewInfoDrawer = () => {
    setViewInfoDrawerOpen(false);
  };

  let defaultCloudProvider = "";
  if (service?.cloudProviders?.length > 0) {
    if (service?.cloudProviders?.includes("aws")) {
      defaultCloudProvider = "aws";
    } else if (service?.cloudProviders?.includes("gcp")) {
      defaultCloudProvider = "gcp";
    }
  }

  //create resource instance
  const createformik = useFormik({
    initialValues: {
      serviceId: serviceId,
      cloud_provider: defaultCloudProvider,
      network_type: service?.supportsPublicNetwork ? "PUBLIC" : "INTERNAL",
      region: "",
      requestParams: { ...requestParams },
      serviceProviderId: service?.serviceProviderId,
      serviceKey: service?.serviceURLKey,
      serviceAPIVersion: service?.serviceAPIVersion,
      serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
      serviceModelKey: service?.serviceModelURLKey,
      productTierKey: service?.productTierURLKey,
      resourceKey: selectedResource.key,
      subscriptionId: subscriptionData?.id,
      ...(isCurrentResourceBYOA
        ? {
            configMethod:
              defaultCloudProvider == CLOUD_PROVIDERS.aws
                ? ACCOUNT_CREATION_METHODS.CLOUDFORMATION
                : ACCOUNT_CREATION_METHODS.TERRAFORM,
          }
        : {}),
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const data = cloneDeep(values);
      setIsCustomDNS(false);
      async function getSchema() {
        try {
          let schemaArray = [];
          const schema = await describeServiceOfferingResource(
            serviceId,
            selectedResource.id,
            "none"
          );
          schema.data.apis.forEach((api) => {
            if (api.verb === "CREATE") {
              schemaArray = api.inputParameters;
            }
          });
          schemaArray
            .filter(
              (field) => field.type === "Boolean" && field.custom === true
            )
            .forEach((field) => {
              if (!data.requestParams[field.key]) {
                data.requestParams[field.key] = "false";
              }
            });

          let isTypeError = false;
          Object.keys(data.requestParams).forEach((key) => {
            const result = schemaArray.find((schemaParam) => {
              return schemaParam.key === key;
            });

            switch (result.type) {
              case "Number":
                {
                  data.requestParams[key] = Number(data.requestParams[key]);
                }
                break;
              case "Float64":
                {
                  const output = Number(data.requestParams[key]);
                  {
                    if (!Number.isNaN(output)) {
                      data.requestParams[key] = Number(data.requestParams[key]);
                    } else {
                      snackbar.showError(`Invalid data in ${key}`);
                      isTypeError = true;
                    }
                  }
                }
                break;
              case "Boolean":
                {
                  if (data.requestParams[key] === "true")
                    data.requestParams[key] = true;
                  else data.requestParams[key] = false;
                }
                break;
            }
          });

          //remove empty fields from data.requestParams
          //remove the field from payload if it has an empty value ("", )
          for (const key in data.requestParams) {
            const value = data.requestParams[key];

            //for gcp cloud provider remove cloud_provider_native_network_id field
            if (
              key === "cloud_provider_native_network_id" &&
              values.cloud_provider === "gcp"
            ) {
              delete data.requestParams[key];
            }

            if (value === undefined || value === "") {
              delete data.requestParams[key];
            }
          }

          //Check if any of the required parameters is not present in payload
          //cloud_provider, network_type and region if required should be present as direct property of data object
          //other required parameters should be present in data.requestParameters
          let isError = false;
          let requiredFieldName = "";
          for (const param of schemaArray) {
            if (param.required) {
              if (
                [
                  "cloud_provider",
                  "network_type",
                  "region",
                  "custom_network_id",
                ].includes(param.key)
              ) {
                if (data[param.key] === undefined) {
                  isError = true;
                  requiredFieldName = param.displayName;
                  break;
                }
              } else {
                if (param.custom) {
                  if (data.requestParams[param.key] === undefined) {
                    isError = true;
                    requiredFieldName = param.displayName;
                    break;
                  }
                }
              }
            }

            if (
              param.key === "custom_availability_zone" &&
              data.requestParams[param.key] === ""
            ) {
              isError = true;
              requiredFieldName = param.displayName;
              break;
            }

            if (isCurrentResourceBYOA) {
              // For BYOA Cloud Provider Resource, we need to set a few additional parameters
              if (values.cloud_provider === "gcp") {
                if (!data.requestParams.gcp_project_number) {
                  isError = true;
                  requiredFieldName = "Project Number";
                } else if (!data.requestParams.gcp_project_id) {
                  isError = true;
                  requiredFieldName = "Project ID";
                } else {
                  data.requestParams.gcp_service_account_email =
                    getGcpServiceEmail(
                      data.requestParams.gcp_project_id,
                      selectedUser.orgId.toLowerCase()
                    );
                }
              } else if (values.cloud_provider === "aws") {
                if (!data.requestParams.aws_account_id) {
                  isError = true;
                  requiredFieldName = "Account ID";
                }
              }

              data.requestParams.account_configuration_method =
                values.configMethod;
            }
          }

          let isCloudProvider = false;
          for (const param of schemaArray) {
            if (["cloud_provider"].includes(param.key)) {
              isCloudProvider = true;
            }
          }

          for (const param of schemaArray) {
            if (["custom_dns_configuration"].includes(param.key)) {
              if (data.requestParams.custom_dns_configuration) {
                setIsCustomDNS(true);
              }
              const resourceKey = selectedResource.key;
              data.requestParams.custom_dns_configuration = {
                [resourceKey]: data.requestParams.custom_dns_configuration,
              };
            }
          }

          if (
            !isCloudProvider ||
            isMultiTenancy ||
            !service?.supportsPublicNetwork
          ) {
            delete data["network_type"];
          }

          if (!isTypeError) {
            if (isError) {
              snackbar.showError(`${requiredFieldName} is required`);
            } else {
              /* eslint-disable-next-line no-use-before-define */
              createResourceInstanceMutation.mutate(data);
            }
          }
        } catch (err) {
          console.error("error", err);
        } finally {
          setIsCreateInstanceSchemaFetching(false);
        }
      }
      setIsCreateInstanceSchemaFetching(true);
      getSchema();
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const createResourceInstanceMutation = useMutation(
    (payload) => {
      if (isCurrentResourceBYOA) {
        const aws_account_id = payload?.requestParams?.aws_account_id;
        if (aws_account_id) {
          payload.requestParams.aws_bootstrap_role_arn =
            getAwsBootstrapArn(aws_account_id);
          setCloudProvider("aws");
        } else {
          setCloudProvider("gcp");
        }
        if (payload.configMethod === ACCOUNT_CREATION_METHODS.CLOUDFORMATION) {
          setAccountConfigMethod("CloudFormation");
        }
      }
      return createResourceInstance(payload);
    },
    {
      onSuccess: async (response) => {
        const resourceInstanceId = response?.data?.id;
        if (selectedResource?.id.includes("r-injectedaccountconfig")) {
          const resourceInstanceResponse = await getResourceInstanceDetails(
            service.serviceProviderId,
            service.serviceURLKey,
            service.serviceAPIVersion,
            service.serviceEnvironmentURLKey,
            service.serviceModelURLKey,
            service.productTierURLKey,
            selectedResource.key,
            resourceInstanceId,
            subscriptionData?.id
          );

          const resourceInstance = resourceInstanceResponse.data;
          snackbar.showSuccess("Cloud Provider Account Created");
          setAccountConfigStatus(resourceInstance?.status);
          setAccountConfigId(resourceInstance?.id);

          handleOrgIdModalOpen();
          setIsAccountCreation(true);
        } else {
          snackbar.showSuccess("Created Instance");
          setIsInstanceIdModalOpen(true);
          setInstanceId(resourceInstanceId);
        }

        fetchResourceInstances(selectedResource);
        createformik.resetForm();
        setCreationDrawerOpen(false);
      },
    }
  );

  //reset the cloudprovider instructions modal props once user closes the Modal

  useEffect(() => {
    if (!isOrgIdModalOpen) {
      setIsAccountCreation(false);
      setAccountConfigMethod(undefined);
      setCloudProvider("");
      setAccountConfigStatus("");
      setAccountConfigId("");
    }
  }, [isOrgIdModalOpen]);

  const updateResourceInstanceMutation = useMutation(updateResourceInstance, {
    onSuccess: async () => {
      setSelectionModel([]);
      setUpdateDrawerOpen(false);
      fetchResourceInstances(selectedResource);
      /*eslint-disable-next-line no-use-before-define*/
      updateformik.resetForm();
      snackbar.showSuccess("Updated Resource Instance");
    },
  });

  //-----------------------modify ends-------------------------------------

  const startResourceInstanceMutation = useMutation(startResourceInstance, {
    onSuccess: async () => {
      setSelectionModel([]);

      fetchResourceInstances(selectedResource);
      snackbar.showSuccess("Starting Resource Instance");
    },
  });

  const stopResourceInstanceMutation = useMutation(stopResourceInstance, {
    onSuccess: async () => {
      setSelectionModel([]);

      fetchResourceInstances(selectedResource);
      snackbar.showSuccess("Stopping Resource Instance");
    },
  });

  const restartResourceInstanceMutation = useMutation(restartResourceInstance, {
    onSuccess: async () => {
      setSelectionModel([]);
      fetchResourceInstances(selectedResource);
      snackbar.showSuccess("Rebooting Resource Instance");
    },
  });

  const handleRefresh = () => {
    fetchResourceInstances(selectedResource);
  };

  const AccountConfigCell = ({ id, logo: Logo }) => {
    return (
      <Box display="flex" alignItems="center" gap="12px">
        <Box
          sx={{
            borderRadius: "4px",
            boxShadow: "0px 1px 2px 0px #1018280D",
            width: "22px",
            height: "22px",
            border: "1px solid #EAECF0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={Logo} alt="cloud-icon" />
        </Box>
        {id}
      </Box>
    );
  };
  //reset states when product tier id/ subscription id changes
  useEffect(() => {
    dispatch(setResourceInstanceList([]));
    setSelectedResource({
      key: "",
      id: "",
      name: "",
      isDeprecated: false,
      isBackupEnabled: false,
      resourceType: "",
    });
    setViewResourceInfo({});
    setSelectedResourceInstances([]);
    setRequestParams([]);
  }, [productTierId, subscriptionId, dispatch]);

  useEffect(() => {
    if (
      servicesLoadingStatus === loadingStatuses.success &&
      isSubscriptionDataFetched
    ) {
      if (service?.resourceParameters?.length > 0) {
        const cloudProviderRes = service.resourceParameters.filter(
          // this is a temporary fix to unblock production for customer
          // but backend should ensure that id should always be exactly r-injectedaccountconfig
          (param) => param.resourceId?.startsWith("r-injectedaccountconfig")
        );

        if (cloudProviderRes?.length > 0) {
          const cloudProviderResourceInfo = {
            key: cloudProviderRes[0].urlKey,
            id: cloudProviderRes[0].resourceId,
            name: cloudProviderRes[0].name,
            isDeprecated: cloudProviderRes[0].isDeprecated,
          };
          setCloudProviderResource(cloudProviderResourceInfo);
        } else {
          setCloudProviderResource(null);
        }

        let selectedResourceInfo = {};

        if (resourceId) {
          const selectedResource = service?.resourceParameters.find(
            function (resourceParameter) {
              return resourceParameter.resourceId === resourceId;
            }
          );
          selectedResourceInfo = {
            key: selectedResource.urlKey,
            id: selectedResource.resourceId,
            name: selectedResource.name,
            isDeprecated: selectedResource.isDeprecated,
            isBackupEnabled: selectedResource.isBackupEnabled,
            resourceType: selectedResource.resourceType,
          };
        } else {
          selectedResourceInfo = {
            key: service?.resourceParameters[0].urlKey,
            id: service?.resourceParameters[0].resourceId,
            name: service?.resourceParameters[0].name,
            isDeprecated: service?.resourceParameters[0].isDeprecated,
            isBackupEnabled: service?.resourceParameters[0].isBackupEnabled,
            resourceType: selectedResource.resourceType,
          };
        }

        setSelectedResource(selectedResourceInfo);
        //Select First resource key by default when page loads
        currentResourceInfo.current.resourceId = selectedResourceInfo.id;
        currentResourceInfo.current.resourceKey = selectedResourceInfo.key;
        fetchResourceInstances(selectedResourceInfo);
        setCreationDrawerOpen(false);
        setViewInfoDrawerOpen(false);
      } else {
        dispatch(setResourceInstanceList([]));
        setSelectedResource({
          key: "",
          id: "",
          name: "",
          isDeprecated: false,
          isBackupEnabled: false,
          resourceType: "",
        });
        setViewResourceInfo({});
        setSelectedResourceInstances([]);
        setRequestParams([]);
      }
    }
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [
    servicesLoadingStatus,
    resourceId,
    isSubscriptionDataFetched,
    subscriptionId,
  ]);

  async function fetchCloudProviderResourceInstances(
    cloudProviderResourceInfo
  ) {
    const resourceInstanceIdsResponse = await getResourceInstanceIds(
      service.serviceProviderId,
      service.serviceURLKey,
      service.serviceAPIVersion,
      service.serviceEnvironmentURLKey,
      service.serviceModelURLKey,
      service.productTierURLKey,
      cloudProviderResourceInfo.key,
      subscriptionData?.id
    );

    const cloudProviderResourceInstanceIds =
      resourceInstanceIdsResponse.data.ids;
    const cloudProviderResInstances = [];

    await Promise.all(
      cloudProviderResourceInstanceIds.map(async (instanceId) => {
        const cloudProviderResourceInstanceResponse =
          await getResourceInstanceDetails(
            service.serviceProviderId,
            service.serviceURLKey,
            service.serviceAPIVersion,
            service.serviceEnvironmentURLKey,
            service.serviceModelURLKey,
            service.productTierURLKey,
            cloudProviderResourceInfo.key,
            instanceId,
            subscriptionData?.id
          );
        const cloudProviderResourceInstance =
          cloudProviderResourceInstanceResponse.data;

        if (
          ["READY", "RUNNING"].includes(cloudProviderResourceInstance?.status)
        ) {
          //aws
          if (cloudProviderResourceInstance?.result_params?.aws_account_id) {
            const cloudProviderAccount = {
              id: instanceId,
              type: "aws",
              label: `${instanceId} (Account ID - ${cloudProviderResourceInstance?.result_params?.aws_account_id})`,
            };
            cloudProviderResInstances.push(cloudProviderAccount);
          }
          //gcp
          if (cloudProviderResourceInstance?.result_params?.gcp_project_id) {
            const cloudProviderAccount = {
              id: instanceId,
              type: "gcp",
              label: `${instanceId} (Project ID - ${cloudProviderResourceInstance?.result_params?.gcp_project_id})`,
            };
            cloudProviderResInstances.push(cloudProviderAccount);
          }
          //later azure
        }
      })
    );
    setCloudProviderAccounts(cloudProviderResInstances);
  }

  async function fetchResourceInstances(resourceInfo, isRefetching = false) {
    clearExistingTimeout();
    if (selectedResource.key !== resourceInfo?.key) {
      dispatch(setResourceInstanceList([]));
    }

    try {
      const status = isRefetching
        ? loadingStatuses.refetching
        : loadingStatuses.loading;

      dispatch(setResourceInstanceListLoadingStatus(status));

      const resourceInstanceList = [];
      const resourceInstances = {};
      const resourceInstanceIdsResponse = await getResourceInstanceIds(
        service.serviceProviderId,
        service.serviceURLKey,
        service.serviceAPIVersion,
        service.serviceEnvironmentURLKey,
        service.serviceModelURLKey,
        service.productTierURLKey,
        resourceInfo.key,
        subscriptionData?.id
      );
      const resourceInstanceIds = resourceInstanceIdsResponse.data.ids;
      await Promise.all(
        resourceInstanceIds.map(async (resourceInstanceId) => {
          const resourceInstanceResponse = await getResourceInstanceDetails(
            service.serviceProviderId,
            service.serviceURLKey,
            service.serviceAPIVersion,
            service.serviceEnvironmentURLKey,
            service.serviceModelURLKey,
            service.productTierURLKey,
            resourceInfo.key,
            resourceInstanceId,
            subscriptionData?.id
          );
          const resourceInstance = resourceInstanceResponse.data;

          const resourceInstanceSchema = await getResourceSchema(
            resourceInfo.id
          );

          resourceInstance["schema"] = resourceInstanceSchema.data;
          resourceInstanceList.push();
          resourceInstances[resourceInstance.id] = resourceInstance;
        })
      );

      resourceInstanceIds.forEach((id) => {
        resourceInstanceList.push(resourceInstances[id]);
      });

      //Check resource id and key before setting data to deal with race conditions
      if (
        resourceInfo.id === currentResourceInfo.current.resourceId &&
        resourceInfo.key === currentResourceInfo.current.resourceKey &&
        isUnmounted.current === false
      ) {
        dispatch(setResourceInstanceList(resourceInstanceList));
        dispatch(setResourceInstanceListLoadingStatus(loadingStatuses.success));
        const id = setTimeout(() => {
          fetchResourceInstances(resourceInfo, true);
        }, 60000);
        timeoutID.current = id;
      }
    } catch (err) {
      dispatch(setResourceInstanceListLoadingStatus(loadingStatuses.error));
      console.error("error", err);
      if (
        resourceInfo.id === currentResourceInfo.current.resourceId &&
        resourceInfo.key === currentResourceInfo.current.resourceKey &&
        isUnmounted.current === false
      ) {
        const id = setTimeout(() => {
          fetchResourceInstances(resourceInfo, true);
        }, 60000);
        timeoutID.current = id;
      }
    }
  }

  function fetchResourceInstancesOfSelectedResource() {
    return fetchResourceInstances(selectedResource);
  }

  async function getResourceSchema(resourceId) {
    const resourceInstanceSchema = await describeServiceOfferingResource(
      serviceId,
      resourceId,
      "none"
    );
    return resourceInstanceSchema;
  }

  useEffect(() => {
    dispatch(setResourceInstanceListToEmpty());
  }, [dispatch]);

  function clearExistingTimeout() {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
  }

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
      clearExistingTimeout();
    };
  }, []);

  useEffect(() => {
    const selectedInstances = [];
    selectionModel.forEach((instanceId) => {
      const instance = resourceInstancesHashmap[instanceId];
      selectedInstances.push(instance);
    });
    setSelectedResourceInstances(selectedInstances);
  }, [selectionModel, resourceInstancesHashmap]);

  const openClickDelete = () => {
    setIsConfirmationDialog(true);
  };

  const isSingleInstanceSelected = selectedResourceInstances.length === 1;

  if (isSingleInstanceSelected) {
    selectedResourceInstance = selectedResourceInstances[0];
  }

  //--------------------modify Service Component instance---------------------------
  const updateformik = useFormik({
    initialValues: {
      serviceId: serviceId,
      id: selectedResourceInstance?.id,
      cloud_provider:
        selectedResourceInstance?.result_params?.cloud_provider ||
        selectedResourceInstance?.cloud_provider, // The first item would be defined in case of BYOA Provider Account Instances
      network_type: selectedResourceInstance?.network_type,
      region: selectedResourceInstance?.region,
      serviceProviderId: service?.serviceProviderId,
      serviceKey: service?.serviceURLKey,
      serviceAPIVersion: service?.serviceAPIVersion,
      serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
      serviceModelKey: service?.serviceModelURLKey,
      productTierKey: service?.productTierURLKey,
      resourceKey: selectedResource.key,
      requestParams: selectedResourceInstance?.result_params || {},
      subscriptionId: subscriptionData?.id,
    },
    onSubmit: async (values) => {
      const data = { ...values };

      try {
        let schemaArray = [];
        const schema = await describeServiceOfferingResource(
          serviceId,
          selectedResource.id,
          values.id
        );

        schema.data.apis.forEach((api) => {
          if (api.verb === "UPDATE") {
            schemaArray = api.inputParameters;
          }
        });

        schemaArray
          .filter((field) => field.type === "Boolean" && field.custom === true)
          .forEach((field) => {
            if (!data.requestParams[field.key]) {
              data.requestParams[field.key] = "false";
            }
          });

        // Only send the fields that have changed
        const requestParams = {},
          oldResultParams = selectedResourceInstance?.result_params;

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
          const result = schemaArray.find((schemaParam) => {
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
        if (!isTypeError) {
          updateResourceInstanceMutation.mutate(data);
        }
      } catch (err) {
        console.error("error", err);
      }
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const closeUpdateDrawer = () => {
    setUpdateDrawerOpen(false);

    updateformik.resetForm();
  };

  const closeCreationDrawer = () => {
    setCreationDrawerOpen(false);
    createformik.resetForm();
  };

  const handleStart = () => {
    startResourceInstanceMutation.mutate(updateformik.values);
  };

  const handleStop = () => {
    stopResourceInstanceMutation.mutate(updateformik.values);
  };

  const handleReboot = () => {
    restartResourceInstanceMutation.mutate(updateformik.values);
  };

  //Capacity payload data
  const capacityData = useMemo(() => {
    return {
      instanceId: selectedResourceInstance?.id,
      serviceProviderId: service?.serviceProviderId,
      serviceKey: service?.serviceURLKey,
      serviceAPIVersion: service?.serviceAPIVersion,
      serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
      serviceModelKey: service?.serviceModelURLKey,
      productTierKey: service?.productTierURLKey,
      resourceKey: selectedResource?.key,
      subscriptionId: subscriptionData?.id,
    };
  }, [
    selectedResourceInstance,
    service,
    selectedResource,
    subscriptionData?.id,
  ]);

  if (isServiceLoading || isLoadingSubscription) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        accessPage
        marketplacePage={currentSource === "access" ? false : true}
        SidebarUI={""}
        customLogo
        currentSubscription={subscriptionData}
        pageType={sidebarActiveOptions.instancesList}
      >
        <Box
          display="flex"
          justifyContent="center"
          mt="200px"
          marginBottom="100px"
        >
          <div style={{ marginTop: "50px" }}>
            <CircularProgress style={{ marginLeft: "50px" }} /> <br />
          </div>
        </Box>
      </DashboardLayout>
    );
  }

  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource
  );
  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
    subscriptionData?.id
  );

  //handle the case of when someone tries to access the service w/o releasing
  if (service?.notAvailable || service?.serviceModelStatus === "DEPLOYING") {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        accessPage
        currentSubscription={subscriptionData}
        pageType={sidebarActiveOptions.instancesList}
      >
        <OfferingUnavailableUI />
      </DashboardLayout>
    );
  }

  if (
    service &&
    service.resourceParameters &&
    service.resourceParameters.length === 0
  ) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        currentSubscription={subscriptionData}
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        enableConsumptionLinks
        serviceName={service?.serviceName}
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        apiDocsurl={serviceAPIDocsLink}
        serviceLogoURL={service?.serviceLogoURL}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceLoading}
            serviceName={service?.serviceName}
            activeResourceId={resourceId}
            productTierId={productTierId}
            currentSource={currentSource}
            selectedResource={selectedResource.key}
            currentSubscription={subscriptionData}
          />
        }
        pageType={sidebarActiveOptions.instancesList}
      >
        <Card mt={3} style={{ height: "700px", width: "100%" }}>
          <Box>
            <Image
              style={{ height: "500px", width: "100%", marginTop: "50px" }}
              src={marketplaceIcon}
              alt="image-icon"
            />
            <Box mt="-300px">
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "50px",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                No resources
              </div>
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                available for
              </div>
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                {service?.serviceName} Service
              </div>
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "100px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                <Link
                  href={servicePlanUrlLink}
                  style={{ color: "#1E22FB", marginRight: "5px" }}
                >
                  {" "}
                  <Image src={marketplaceReturnIcon} alt="image-icon" /> Click
                  Here
                </Link>
                to go back
              </div>
            </Box>
          </Box>
        </Card>
        <SideDrawerRight
          size="xlarge"
          open={supportDrawerOpen}
          closeDrawer={closeSupportDrawer}
          RenderUI={
            <AccessSupport
              service={service}
              currentTabValue={currentTabValue}
            />
          }
        />
      </DashboardLayout>
    );
  }

  function getTheHostingModel(hostingModel) {
    switch (hostingModel) {
      case "OMNISTRATE_HOSTED":
      case "Omnistrate hosted model":
        return "Omnistrate Hosted";

      case "CUSTOMER_HOSTED":
      case "MyAccount hosted model":
        return "Provider Hosted";

      case "BYOA":
      case "BYOA hosted model":
        return "Customer Hosted (BYOA)";
    }
  }

  const isCustomNetworksView = viewType === "custom-networks";

  if (!isLoadingSubscription && !subscriptionData?.id) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage
        customLogo
        accessPage
        currentSubscription={subscriptionData}
        pageType={sidebarActiveOptions.instancesList}
      >
        <>
          <SubscriptionNotFoundUI />
        </>
      </DashboardLayout>
    );
  }

  if (service) {
    const modelType = service.serviceModelType;
    const isCustomTenancy =
      service.productTierType === productTierTypes.CUSTOM_TENANCY;
    const deploymentHeader = getTheHostingModel(modelType);

    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        currentSubscription={subscriptionData}
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        enableConsumptionLinks
        serviceName={service?.serviceName}
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        apiDocsurl={serviceAPIDocsLink}
        serviceLogoURL={service?.serviceLogoURL}
        environmentId={environmentId}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceLoading}
            serviceName={service?.serviceName}
            activeResourceId={resourceId}
            productTierId={productTierId}
            currentSource={currentSource}
            selectedResource={selectedResource.key}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
            isCustomNetworkActive={isCustomNetworksView}
          />
        }
        pageType={sidebarActiveOptions.instancesList}
      >
        <Stack direction="row" justifyContent={"space-between"}>
          <Box
            display="flex"
            //@ts-ignore
            flexDirection="colunm"
            justifyContent="flex-start"
          >
            <Box paddingTop={"5px"}>
              <DashboardHeaderIcon />
            </Box>
            <LogoHeader
              margin={0}
              title={
                isCustomNetworksView
                  ? "Custom Networks"
                  : `${selectedResource?.name} Instances`
              }
              desc=""
            />
          </Box>
          {!isCustomTenancy && <AccessServiceHealthStatus />}
        </Stack>
        <Stack direction="row" justifyContent="flex-end" mt="16px">
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
            onClick={() => dispatch(toggleInstanceListSummaryVisibility())}
          >
            {insightsVisible ? "Hide Insights" : "View Insights"}{" "}
          </Button>
        </Stack>
        <Collapse in={insightsVisible}>
          <AccessHeaderCard
            serviceName={service?.serviceName}
            deploymentHeader={deploymentHeader}
            productTierType={service?.productTierType}
            environmentName={service?.serviceEnvironmentName}
            productTierName={service?.productTierName}
            currentSubscription={subscriptionData}
            cloudProviders={service?.cloudProviders}
          />
        </Collapse>

        {isCustomNetworksView ? (
          <CustomNetworks
            cloudProviders={service?.cloudProviders}
            supportedAWSRegions={service?.awsRegions || []}
            supportedGCPRegions={service?.gcpRegions || []}
            serviceId={serviceId}
            productTierId={productTierId}
          />
        ) : (
          <>
            <Box
              mt={insightsVisible ? "32px" : "10px"}
              sx={{
                transition: "margin-top 0.5s ease-in-out",
              }}
            >
              <DataGrid
                components={{
                  Header: InstancesTableHeader,
                }}
                columns={columns}
                rows={isLoading ? [] : filteredInstances}
                checkboxSelection
                selectionModel={selectionModel}
                disableSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                    {
                      display: "none",
                    },
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  border: "1px solid rgba(228, 231, 236, 1)",
                }}
                onCellClick={(props) => {
                  const { field } = props;
                  if (field === "view") {
                    setViewResourceInfo(props.row);
                    openViewInfoDrawer();
                  }
                }}
                componentsProps={{
                  header: {
                    count: filteredInstances?.length,
                    selectedInstance: selectedResourceInstance,
                    isFetchingInstances: isLoading,
                    selectedResourceName: selectedResource?.name,
                    handleRefresh,
                    searchText,
                    setSearchText,
                    isCurrentResourceBYOA,
                    handleRestart: handleReboot,
                    handleStart,
                    handleStop,
                    handleRestore: handleRestoreInstanceModalOpen,
                    handleAddCapacity: () => {
                      setShowCapacityDialog(true);
                      setCurrentCapacityAction("add");
                    },
                    handleRemoveCapacity: () => {
                      setShowCapacityDialog(true);
                      setCurrentCapacityAction("remove");
                    },
                    handleModify: openUpdateDrawer,
                    handleCreate: openCreationDrawer,
                    handleDelete: openClickDelete,
                    maxNumberOfInstancesReached,
                    roleType: subscriptionData?.roleType,
                    isDeprecated: selectedResource?.isDeprecated,
                    isResourceParameters: service?.resourceParameters,
                    isVisibleRestore: selectedResource?.isBackupEnabled,
                    selectedResourceId: selectedResource?.id,
                  },
                }}
                noRowsText={`No instance of ${selectedResource.name} found for ${service?.serviceName}`}
                onSelectionModelChange={(newSelection) => {
                  selectSingleItem(
                    newSelection,
                    selectionModel,
                    setSelectionModel
                  );
                }}
                loading={isLoading}
              />
              <SideDrawerRight
                open={viewInfoDrawerOpen}
                closeDrawer={closeViewInfoDrawer}
                RenderUI={
                  <ResourceInfoView
                    isBYOA={isCurrentResourceBYOA}
                    data={viewResourceInfo}
                    serviceName={service?.serviceName}
                  />
                }
              />
              <SideDrawerRight
                open={updateDrawerOpen}
                closeDrawer={closeUpdateDrawer}
                RenderUI={
                  <ResourceUpdateView
                    isCurrentResourceBYOA={isCurrentResourceBYOA}
                    formData={updateformik}
                    regions={{
                      aws: service?.awsRegions || [],
                      gcp: service?.gcpRegions || [],
                    }}
                    formCancelClick={closeUpdateDrawer}
                    isLoading={updateResourceInstanceMutation.isLoading}
                    serviceName={service?.serviceName}
                    serviceId={serviceId}
                    selectedResourceKey={selectedResource}
                  />
                }
              />

              <CapacityDialog
                open={showCapacityDialog}
                handleClose={() => {
                  setShowCapacityDialog(false);
                }}
                autoscaling={{
                  currentReplicas: selectedResourceInstance?.currentReplicas,
                  maxReplicas: selectedResourceInstance?.maxReplicas,
                  minReplicas: selectedResourceInstance?.minReplicas,
                }}
                data={capacityData}
                currentCapacityAction={currentCapacityAction}
                contextType="access"
                refetch={fetchResourceInstancesOfSelectedResource}
              />
              {isCurrentResourceBYOA ? (
                <DeleteAccountConfigConfirmationDialog
                  open={isConfirmationDialog}
                  handleClose={handleConfirmationClose}
                  formData={deleteformik}
                  title="Delete Confirmation"
                  isLoading={deleteResourceInstanceMutation.isLoading}
                />
              ) : (
                <ConfirmationDialog
                  open={isConfirmationDialog}
                  handleClose={handleConfirmationClose}
                  formData={deleteformik}
                  title={`Do you want to delete this ${selectedResource.name} instance?`}
                  subtitle={`Are you sure you want to delete - ${selectedResourceInstances[0]?.id}?`}
                  message={`To confirm deletion, please enter <b>deleteme</b>, in the field below:`}
                  buttonLabel="Confirm"
                  isLoading={deleteResourceInstanceMutation.isLoading}
                  isDeleteEnable={true}
                />
              )}

              <SideDrawerRight
                open={creationDrawerOpen}
                closeDrawer={closeCreationDrawer}
                RenderUI={
                  <CreateResourceInstanceForm
                    downloadTerraformKitMutation={downloadTerraformKitMutation}
                    isBYOA={isCurrentResourceBYOA}
                    requestParams={requestParams}
                    formCancelClick={closeCreationDrawer}
                    formData={createformik}
                    serviceName={service?.serviceName}
                    serviceId={serviceId}
                    selectedResourceKey={selectedResource}
                    isLoading={
                      createResourceInstanceMutation.isLoading ||
                      isCreateInstanceSchemaFetching
                    }
                    setRequestParams={setRequestParams}
                    cloudProviderAccounts={cloudProviderAccounts}
                    service={service}
                    subscriptionId={subscriptionData?.id}
                    handleOrgIdModalOpen={handleOrgIdModalOpen}
                    cloudProviders={service?.cloudProviders}
                    regions={{
                      aws: service?.awsRegions || [],
                      gcp: service?.gcpRegions || [],
                    }}
                    isCustomNetworkEnabled={isCustomNetworkEnabled}
                    isMultiTenancy={isMultiTenancy}
                  />
                }
              />
            </Box>
          </>
        )}
        <SideDrawerRight
          size="xlarge"
          open={supportDrawerOpen}
          closeDrawer={closeSupportDrawer}
          RenderUI={
            <AccessSupport
              service={service}
              currentTabValue={currentTabValue}
            />
          }
        />

        <CreateResourceInstanceModel
          open={isInstanceIdModalOpen}
          handleClose={handleInstanceIdModalClose}
          instanceId={instanceId}
          isCustomDNS={isCustomDNS}
        />

        <CloudProviderAccountOrgIdModal
          orgId={subscriptionData?.accountConfigIdentityId}
          handleClose={handleOrgIdModalClose}
          open={isOrgIdModalOpen}
          isAccountCreation={isAccountCreation}
          accountConfigMethod={accountConfigMethod}
          cloudFormationTemplateUrl={cloudFormationTemplateUrl}
          cloudProvider={cloudProvider}
          isAccessPage={true}
          downloadTerraformKitMutation={downloadTerraformKitMutation}
          accountConfigStatus={accountConfigStatus}
          accountConfigId={accountConfigId}
          service={service}
          selectedResourceKey={selectedResource.key}
          subscriptionId={subscriptionData?.id}
          setCloudFormationTemplateUrl={setCloudFormationTemplateUrl}
          setCloudFormationTemplateUrlNoLB={setCloudFormationTemplateUrlNoLB}
          fetchResourceInstancesOfSelectedResource={
            fetchResourceInstancesOfSelectedResource
          }
          cloudFormationTemplateUrlNoLB={cloudFormationTemplateUrlNoLB}
          viewInstructionsItem={viewInstructionsItem}
        />

        <AccessSideRestoreInstance
          open={isRestoreInstanceModalOpen}
          handleClose={handleRestoreInstanceModalClose}
          earliestRestoreTime={
            selectedResourceInstance?.backupStatus?.earliestRestoreTime
          }
          service={service}
          setSelectionModel={setSelectionModel}
          fetchResourceInstances={fetchResourceInstances}
          selectedResource={selectedResource}
          subscriptionId={subscriptionData?.id}
          selectedInstanceId={selectedResourceInstance?.id}
          networkType={selectedResourceInstance?.network_type}
        />
      </DashboardLayout>
    );
  }
}

export default MarketplaceService;

export const OfferingUnavailableUI = () => {
  return (
    <Card mt={3} style={{ height: "700px", width: "100%" }}>
      <Box>
        <Image
          style={{ height: "500px", width: "100%", marginTop: "50px" }}
          src={marketplaceIcon}
          alt="image-icon"
        />
        <Box mt="-300px">
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "50px",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            Service Offering
          </div>
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            not available
          </div>
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          />
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "100px",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};
