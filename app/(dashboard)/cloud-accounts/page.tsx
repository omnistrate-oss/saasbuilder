"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import formatDateUTC from "src/utils/formatDateUTC";
import DataTable from "components/DataTable/DataTable";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import DataGridText from "components/DataGrid/DataGridText";
import AzureLogo from "components/Logos/AzureLogo/AzureLogo";

import PageTitle from "../components/Layout/PageTitle";
import CloudAccountForm from "./components/CloudAccountForm";
import PageContainer from "../components/Layout/PageContainer";
import CloudAccountsIcon from "../components/Icons/CloudAccountsIcon";
import CloudAccountsTableHeader from "./components/CloudAccountsTableHeader";
import FullScreenDrawer from "../components/FullScreenDrawer/FullScreenDrawer";

import { ResourceInstance } from "src/types/resourceInstance";
import useInstances from "../instances/hooks/useInstances";

const columnHelper = createColumnHelper<ResourceInstance>(); // TODO: Add type

type Overlay = "delete-dialog" | "create-instance-form";

const CloudAccountsPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "create-instance-form"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const {
    data: instances = [],
    isLoading: isLoadingInstances,
    isFetching: isFetchingInstances,
    refetch: refetchInstances,
  } = useInstances();

  const byoaInstances = useMemo(
    () =>
      instances.filter(
        // @ts-ignore
        (instance) => instance.result_params?.account_configuration_method
      ),
    [instances]
  );

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor(
        (row) =>
          // @ts-ignore
          row.result_params?.gcp_project_id ||
          // @ts-ignore
          row.result_params?.aws_account_id ||
          "-",
        {
          id: "account_id",
          header: "Account ID",
          cell: (data) => {
            const value =
              // @ts-ignore
              data.row.original.result_params?.gcp_project_id ||
              // @ts-ignore
              data.row.original.result_params?.aws_account_id ||
              "-";

            return (
              <DataGridText showCopyButton={value !== "-"}>
                {value}
              </DataGridText>
            );
          },
        }
      ),
      columnHelper.accessor(
        // @ts-ignore
        (row) => row.cloud_provider || row.result_params?.cloud_provider || "-",
        {
          id: "cloud_provider",
          header: "Provider",
          cell: (data) => {
            const cloudProvider =
              data.row.original.cloud_provider ||
              // @ts-ignore
              data.row.original.result_params?.cloud_provider;

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
        }
      ),
      columnHelper.accessor((row) => formatDateUTC(row.created_at), {
        id: "created_at",
        header: "Created On",
        cell: (data) => {
          return data.row.original.created_at
            ? formatDateUTC(data.row.original.created_at)
            : "-";
        },
        meta: {
          minWidth: 225,
        },
      }),
    ];
  }, []);

  return (
    <PageContainer>
      <PageTitle icon={CloudAccountsIcon} className="mb-6">
        Cloud Accounts
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={byoaInstances}
          noRowsText="No cloud accounts"
          HeaderComponent={CloudAccountsTableHeader}
          headerProps={{
            count: byoaInstances.length,
            searchText,
            setSearchText,
            onCreateClick: () => {
              setIsOverlayOpen(true);
              setOverlayType("create-instance-form");
            },
            onDeleteClick: () => {
              setIsOverlayOpen(true);
              setOverlayType("delete-dialog");
            },
            selectedRows,
            refetchInstances: refetchInstances,
            isFetchingInstances: isFetchingInstances,
          }}
          isLoading={isLoadingInstances}
          selectionMode="single"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
        />
      </div>

      <FullScreenDrawer
        title="Cloud Account"
        description="Create a new cloud account"
        open={isOverlayOpen && overlayType === "create-instance-form"}
        closeDrawer={() => setIsOverlayOpen(false)}
        RenderUI={<CloudAccountForm onClose={() => setIsOverlayOpen(false)} />}
      />
    </PageContainer>
  );
};

export default CloudAccountsPage;
