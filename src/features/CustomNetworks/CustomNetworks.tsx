import { FC, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import DataGrid, { selectSingleItem } from "components/DataGrid/DataGrid";
import SideDrawerRight from "components/SideDrawerRight/SideDrawerRight";
import DataGridText from "components/DataGrid/DataGridText";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import useSnackbar from "src/hooks/useSnackbar";
import { CustomNetwork } from "src/types/customNetwork";
import useCustomNetworks from "./hooks/useCustomNetworks";
import { deleteCustomNetwork } from "src/api/customNetworks";
import CustomNetworkForm from "./components/CreateCustomNetworkForm";
import CustomNetworkDataGridHeader from "./components/CustomNetworkDataDridHeader";
import TextConfirmationDialog from "src/components/TextConfirmationDialog/TextConfirmationDialog";
import useCloudProviderRegions from "src/hooks/query/useCloudProviderRegions";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import RegionIcon from "src/components/Region/RegionIcon";
import { CloudProvider } from "src/types/common/enums";
import PeeringInfoDialog, {
  ListItemProps,
} from "./components/PeeringInfoDialog";
import GcpLogo from "src/components/Logos/GcpLogo/GcpLogo";
import AwsLogo from "src/components/Logos/AwsLogo/AwsLogo";

type CustomNetworkProps = {
  cloudProviders: CloudProvider[];
  //array of supported aws, gcp region codes
  supportedAWSRegions: string[];
  supportedGCPRegions: string[];
  serviceId: string;
  productTierId: string;
};

const CustomNetworks: FC<CustomNetworkProps> = (props) => {
  const {
    cloudProviders = [],
    supportedAWSRegions,
    supportedGCPRegions,
    serviceId,
    productTierId,
  } = props;
  const snackbar = useSnackbar();
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [selectedCustomNetwork, setSelectedCustomNetwork] =
    useState<CustomNetwork | null>(null);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [showPeeringInfoDialoag, setShowPeeringInfoDialoag] = useState(false);
  const [selectedCustomNetworkIds, setSelectedCustomNetworkIds] = useState<
    string[]
  >([]);
  const [searchText, setSearchText] = useState("");

  const cloudProviderRegionsQuery = useCloudProviderRegions(
    serviceId,
    productTierId,
    cloudProviders
  );

  const { data: cloudProviderRegions = [] } = cloudProviderRegionsQuery;

  const {
    data: customNetworks = [],
    isFetching: isFetchingCustomNetworks,
    isLoading: isLoadingCustomNetworks,
    refetch: refetchCustomNetworks,
  } = useCustomNetworks();

  const filteredCustomNetworks = useMemo(() => {
    let filtered = customNetworks;

    filtered = customNetworks.filter((customNetwork) => {
      const cloudProvider = customNetwork.cloudProviderName;
      const region = customNetwork.cloudProviderRegion;

      const belongsToSupportedCloudProvider = cloudProviders.includes(
        customNetwork.cloudProviderName
      );

      let belongsToSupportedRegion = false;

      if (cloudProvider === "aws") {
        belongsToSupportedRegion = supportedAWSRegions.includes(region);
      } else if (cloudProvider === "gcp") {
        belongsToSupportedRegion = supportedGCPRegions.includes(region);
      }

      return belongsToSupportedCloudProvider && belongsToSupportedRegion;
    });

    return filtered;
  }, [
    customNetworks,
    cloudProviders,
    supportedAWSRegions,
    supportedGCPRegions,
  ]);

  const openSideDrawer = () => {
    setIsSideDrawerOpen(true);
  };

  const closeSideDrawer = () => {
    setSelectedCustomNetwork(null);
    setIsSideDrawerOpen(false);
  };

  const deleteCustomNetworkMutation = useMutation(
    (data: CustomNetwork) => {
      const { id } = data;
      return deleteCustomNetwork(id);
    },
    {
      onSuccess: async () => {
        refetchCustomNetworks();
        closeSideDrawer();
        setShowDeleteConfirmationDialog(false);
        /*eslint-disable-next-line no-use-before-define*/
        deleteformik.resetForm();
        snackbar.showSuccess("Custom Network deleted");
      },
    }
  );

  const deleteformik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: (values) => {
      if (values.confirmationText === "deleteme") {
        deleteCustomNetworkMutation.mutate(selectedCustomNetwork);
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const peeringInfoList: ListItemProps[] = useMemo(() => {
    if (!selectedCustomNetworkIds.length || !customNetworks) {
      return [];
    }

    const selectedCustomNetwork = customNetworks.find(
      (customNetwork) => customNetwork.id === selectedCustomNetworkIds[0]
    );

    const networkInstance = selectedCustomNetwork?.networkInstances?.[0] || {};
    const res: ListItemProps[] = [];
    if (networkInstance.awsAccountID) {
      res.push({
        title: "Account ID",
        value: networkInstance.awsAccountID,
        icon: <AwsLogo />,
      });
    } else if (networkInstance.gcpProjectID) {
      res.push({
        title: "Project ID",
        value: networkInstance.gcpProjectID,
        icon: <GcpLogo />,
      });
      res.push({
        title: "Project Number",
        value: networkInstance.gcpProjectNumber,
      });
    }

    if (networkInstance.cloudProviderNativeNetworkId) {
      res.push({
        title: "VPC Info",
        value: networkInstance.cloudProviderNativeNetworkId,
      });
    }
    res.push({
      title: "CIDR",
      value: selectedCustomNetwork.cidr,
    });

    return res;
  }, [selectedCustomNetworkIds, customNetworks]);

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Network ID",
        flex: 1,
        minWidth: 170,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => (
          <DataGridText
            onClick={() => {
              setSelectedCustomNetwork(params.row);
              openSideDrawer();
            }}
            color="primary"
          >
            {params.row.id}
          </DataGridText>
        ),
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 170,
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.name,
      },
      {
        field: "cloudProviderName",
        headerName: "Provider",
        flex: 1,
        minWidth: 150,
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.cloudProviderName,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => {
          const cloudProvider = params.row.cloudProviderName;

          return cloudProviderLogoMap[cloudProvider] || "-";
        },
      },
      {
        field: "cloudProviderRegion",
        headerName: "Region",
        flex: 1,
        minWidth: 100,
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.cloudProviderRegion,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => (
          <GridCellExpand
            value={params.row.cloudProviderRegion}
            startIcon={<RegionIcon />}
          />
        ),
      },
      {
        field: "cidr",
        headerName: "CIDR",
        flex: 1,
        minWidth: 150,
      },
    ],
    []
  );

  if (isLoadingCustomNetworks) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Box mt="20px">
        <DataGrid
          checkboxSelection
          disableColumnMenu
          disableSelectionOnClick
          selectionModel={selectedCustomNetworkIds}
          onSelectionModelChange={(newSelection) => {
            selectSingleItem(
              newSelection,
              selectedCustomNetworkIds,
              setSelectedCustomNetworkIds
            );
          }}
          components={{
            Header: CustomNetworkDataGridHeader,
          }}
          componentsProps={{
            header: {
              count: filteredCustomNetworks.length,
              searchText,
              setSearchText,
              openSideDrawer,
              refetchCustomNetworks,
              isFetchingCustomNetworks,
              openDialog: () => setShowPeeringInfoDialoag(true),
              isPeeringInfoEnabled: selectedCustomNetworkIds.length === 1,
            },
          }}
          columns={columns}
          rows={isFetchingCustomNetworks ? [] : filteredCustomNetworks}
          getRowId={(row: CustomNetwork) => row.id}
          loading={isFetchingCustomNetworks}
          noRowsText="No custom networks"
        />
      </Box>

      <SideDrawerRight
        size={"medium"}
        open={isSideDrawerOpen}
        closeDrawer={closeSideDrawer}
        RenderUI={
          <>
            <CustomNetworkForm
              refetchCustomNetworks={refetchCustomNetworks}
              selectedCustomNetwork={selectedCustomNetwork}
              closeDrawer={closeSideDrawer}
              onDelete={() => {
                setShowDeleteConfirmationDialog(true);
              }}
              cloudProviders={cloudProviders}
              cloudProviderRegions={cloudProviderRegions}
              supportedAWSRegions={supportedAWSRegions}
              supportedGCPRegions={supportedGCPRegions}
            />
          </>
        }
      />

      <TextConfirmationDialog
        open={showDeleteConfirmationDialog}
        handleClose={() => {
          setShowDeleteConfirmationDialog(false);
          deleteformik.resetForm();
        }}
        formData={deleteformik}
        title={`Delete Custom Network`}
        buttonLabel={"Delete"}
        buttonColour={"red"}
        subtitle={`Are you sure you want to delete this custom network?`}
        message={
          "To confirm deletion, please enter <b>deleteme</b>, in the field below:"
        }
        isLoading={deleteCustomNetworkMutation.isLoading}
        isDeleteEnable={true}
      />

      <PeeringInfoDialog
        open={showPeeringInfoDialoag}
        onClose={() => setShowPeeringInfoDialoag(false)}
        list={peeringInfoList}
      />
    </>
  );
};

export default CustomNetworks;
