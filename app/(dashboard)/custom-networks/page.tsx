"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import PageTitle from "../components/Layout/PageTitle";
import useCustomNetworks from "./hooks/useCustomNetworks";
import PageContainer from "../components/Layout/PageContainer";
import CustomNetworkForm from "./components/CustomNetworkForm";
import CustomNetworksIcon from "../components/Icons/CustomNetworksIcon";
import CustomNetworksTableHeader from "./components/CustomNetworksTableHeader";
import FullScreenDrawer from "../components/FullScreenDrawer/FullScreenDrawer";
import PeeringInfoDialog, {
  ListItemProps,
} from "./components/PeeringInfoDialog";

import RegionIcon from "components/Region/RegionIcon";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import DataTable from "components/DataTable/DataTable";
import DataGridText from "components/DataGrid/DataGridText";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";

import useSnackbar from "src/hooks/useSnackbar";
import { CustomNetwork } from "src/types/customNetwork";
import { deleteCustomNetwork } from "src/api/customNetworks";
import useRegions from "./hooks/useRegions";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { getCustomNetworksRoute } from "src/utils/routes";

const columnHelper = createColumnHelper<CustomNetwork>();
type Overlay =
  | "peering-info-dialog"
  | "create-custom-network"
  | "modify-custom-network"
  | "delete-dialog";

const CustomNetworksPage = () => {
  const snackbar = useSnackbar();

  const router = useRouter();
  const searchParams = useSearchParams();
  const overlay = searchParams?.get("overlay");

  const [searchText, setSearchText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "peering-info-dialog"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  // Open the Create Form Overlay when the overlay query param is set to "create"
  useEffect(() => {
    if (overlay === "create") {
      setOverlayType("create-custom-network");
      setIsOverlayOpen(true);
      router.replace(getCustomNetworksRoute({}));
    }
  }, [overlay]);

  const {
    data: customNetworks = [],
    isFetching: isFetchingCustomNetworks,
    refetch: refetchCustomNetworks,
  } = useCustomNetworks();

  const filteredCustomNetworks = useMemo(() => {
    return customNetworks.filter((customNetwork) => {
      return customNetwork.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    });
  }, [customNetworks, searchText]);

  const { data: regions = [], isFetching: isFetchingRegions } = useRegions();

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "Network ID",
        cell: (data) => {
          return (
            <DataGridText
              showCopyButton
              style={{
                fontWeight: 600,
              }}
            >
              {data.row.original.id}
            </DataGridText>
          );
        },
        meta: {
          minWidth: 200,
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
          rows={filteredCustomNetworks}
          noRowsText="No custom networks"
          HeaderComponent={CustomNetworksTableHeader}
          headerProps={{
            count: filteredCustomNetworks.length,
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
              setSelectedRows([]);
              setOverlayType("create-custom-network");
              setIsOverlayOpen(true);
            },
            onModifyClick: () => {
              setOverlayType("modify-custom-network");
              setIsOverlayOpen(true);
            },
          }}
          selectionMode="single"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          isLoading={isFetchingCustomNetworks}
        />
      </div>

      <FullScreenDrawer
        title="Create Custom Network"
        description="Create a new custom network with the specified details"
        open={
          isOverlayOpen &&
          ["create-custom-network", "modify-custom-network"].includes(
            overlayType
          )
        }
        closeDrawer={() => setIsOverlayOpen(false)}
        RenderUI={
          <CustomNetworkForm
            formMode={
              overlayType === "create-custom-network" ? "create" : "modify"
            }
            regions={regions}
            isFetchingRegions={isFetchingRegions}
            refetchCustomNetworks={refetchCustomNetworks}
            onClose={() => setIsOverlayOpen(false)}
            selectedCustomNetwork={customNetworks.find(
              (customNetwork) => customNetwork.id === selectedRows[0]
            )}
          />
        }
      />

      <TextConfirmationDialog
        open={isOverlayOpen && overlayType === "delete-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        onConfirm={async () => {
          if (!selectedRows.length) return;
          await deleteCustomNetworkMutation.mutateAsync(selectedRows[0]);
        }}
        title="Delete Custom Network"
        subtitle={`Are you sure you want to delete - ${selectedRows[0]}?`}
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
