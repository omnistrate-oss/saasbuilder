"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import formatDateUTC from "src/utils/formatDateUTC";
import DataTable from "components/DataTable/DataTable";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import DataGridText from "components/DataGrid/DataGridText";
import AzureLogo from "components/Logos/AzureLogo/AzureLogo";
import SideDrawerRight from "components/SideDrawerRight/SideDrawerRight";

import PageTitle from "../components/Layout/PageTitle";
import CloudAccountForm from "./components/CloudAccountForm";
import PageContainer from "../components/Layout/PageContainer";
import CloudAccountsIcon from "../components/Icons/CloudAccountsIcon";
import CloudAccountsTableHeader from "./components/CloudAccountsTableHeader";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

type Overlay = "delete-dialog" | "create-instance-form";

const CloudAccountsPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "create-instance-form"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor(
        (row) =>
          row.result_params?.gcp_project_id ||
          row.result_params?.aws_account_id ||
          "-",
        {
          id: "account_id",
          header: "Account ID",
          cell: (data) => {
            const value =
              data.row.original.result_params?.gcp_project_id ||
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
        (row) => row.cloud_provider || row.result_params?.cloud_provider || "-",
        {
          id: "cloud_provider",
          header: "Provider",
          cell: (data) => {
            const cloudProvider =
              data.row.original.cloud_provider ||
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
          rows={[]}
          noRowsText="No cloud accounts"
          HeaderComponent={CloudAccountsTableHeader}
          headerProps={{
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
            refetchInstances: () => {}, // TODO:
            isFetchingInstances: false, // TODO:
          }}
          isLoading={false}
          selectionMode="single"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
        />
      </div>

      <SideDrawerRight
        size="xlarge"
        open={isOverlayOpen && overlayType === "create-instance-form"}
        closeDrawer={() => setIsOverlayOpen(false)}
        RenderUI={<CloudAccountForm />}
      />
    </PageContainer>
  );
};

export default CloudAccountsPage;
