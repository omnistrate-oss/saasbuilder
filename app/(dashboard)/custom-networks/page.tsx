"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import PageTitle from "../components/Layout/PageTitle";
import useCustomNetworks from "./hooks/useCustomNetworks";
import PageContainer from "../components/Layout/PageContainer";
import CustomNetworkForm from "./components/CustomNetworkForm";
import CustomNetworksIcon from "../components/Icons/CustomNetworksIcon";
import CustomNetworksTableHeader from "./components/CustomNetworksTableHeader";
import PeeringInfoDialog, {
  ListItemProps,
} from "./components/PeeringInfoDialog";

import RegionIcon from "components/Region/RegionIcon";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import DataTable from "components/DataTable/DataTable";
import DataGridText from "components/DataGrid/DataGridText";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import SideDrawerRight from "components/SideDrawerRight/SideDrawerRight";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";

import useSnackbar from "src/hooks/useSnackbar";
import { CustomNetwork } from "src/types/customNetwork";
import { deleteCustomNetwork } from "src/api/customNetworks";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";

const columnHelper = createColumnHelper<CustomNetwork>();
type Overlay = "peering-info-dialog" | "custom-network-form" | "delete-dialog";

const CustomNetworksPage = () => {
  const snackbar = useSnackbar();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "peering-info-dialog"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  // const [selectedCustomNetwork, setSelectedCustomNetwork] =
  //   useState<CustomNetwork | null>(null);

  const {
    data: customNetworks = [],
    isFetching: isFetchingCustomNetworks,
    refetch: refetchCustomNetworks,
  } = useCustomNetworks();

  console.log(customNetworks);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "Network ID",
        cell: (data) => {
          return (
            <DataGridText
              // onClick={() => {
              //   setSelectedCustomNetwork(data.row.original);
              //   setOverlayType("custom-network-form");
              //   setIsOverlayOpen(true);
              // }}
              // color="primary"
              showCopyButton
            >
              {data.row.original.id}
            </DataGridText>
          );
        },
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: "Name",
      }),
      columnHelper.accessor("cloudProviderName", {
        id: "cloudProviderName",
        header: "Provider",
        cell: (data) => {
          const cloudProvider = data.row.original.cloudProviderName;
          return cloudProviderLogoMap[cloudProvider] || "-";
        },
      }),
      columnHelper.accessor("cloudProviderRegion", {
        id: "cloudProviderRegion",
        header: "Region",
        cell: (data) => {
          return (
            <GridCellExpand
              value={data.row.original.cloudProviderRegion || "Global"}
              startIcon={<RegionIcon />}
            />
          );
        },
      }),
      columnHelper.accessor("cidr", {
        id: "cidr",
        header: "CIDR",
      }),
    ];
  }, []);

  const deleteCustomNetworkMutation = useMutation(deleteCustomNetwork, {
    onSuccess: async () => {
      refetchCustomNetworks();
      setIsOverlayOpen(false);
      snackbar.showSuccess("Custom Network deleted successfully");
    },
  });

  const peeringInfoList: ListItemProps[] = useMemo(() => {
    if (!selectedRows.length || !customNetworks) {
      return [];
    }

    const selectedCustomNetwork = customNetworks.find(
      (customNetwork) => customNetwork.id === selectedRows[0]
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
      value: selectedCustomNetwork?.cidr,
    });

    return res;
  }, [customNetworks, selectedRows]);

  return (
    <PageContainer>
      <PageTitle icon={CustomNetworksIcon} className="mb-6">
        Custom Networks
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No instances"
          HeaderComponent={CustomNetworksTableHeader}
          headerProps={{
            searchText,
            setSearchText,
            onPeeringInfoClick: () => {
              setOverlayType("peering-info-dialog");
              setIsOverlayOpen(true);
            },
            onDeleteClick: () => {
              setOverlayType("delete-dialog");
              setIsOverlayOpen(true);
            },
            refetchCustomNetworks,
            isFetchingCustomNetworks,
            selectedRows,
            onCreateClick: () => {
              setOverlayType("custom-network-form");
              setIsOverlayOpen(true);
            },
          }}
          selectionMode="single"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          isLoading={false}
        />
      </div>

      <SideDrawerRight
        size="xlarge"
        open={isOverlayOpen && overlayType === "custom-network-form"}
        closeDrawer={() => setIsOverlayOpen(false)}
        RenderUI={<CustomNetworkForm />}
      />

      <TextConfirmationDialog
        open={isOverlayOpen && overlayType === "delete-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        onConfirm={() => {
          if (!selectedRows.length) return;
          deleteCustomNetworkMutation.mutate(selectedRows[0]);
        }}
        title="Delete Custom Network"
        subtitle="Are you sure you want to delete this custom network?"
        message="To confirm deletion, please enter <b>deleteme</b>, in the field below:"
        isLoading={deleteCustomNetworkMutation.isLoading}
      />

      <PeeringInfoDialog
        open={isOverlayOpen && overlayType === "peering-info-dialog"}
        onClose={() => setIsOverlayOpen(false)}
        list={peeringInfoList}
      />
    </PageContainer>
  );
};

export default CustomNetworksPage;
