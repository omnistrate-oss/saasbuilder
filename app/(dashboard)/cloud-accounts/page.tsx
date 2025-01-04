"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import formatDateUTC from "src/utils/formatDateUTC";
import DataTable from "src/components/DataTable/DataTable";

import PageTitle from "../components/Layout/PageTitle";
import PageContainer from "../components/Layout/PageContainer";
import CloudAccountsIcon from "../components/Icons/CloudAccountsIcon";
import CloudAccountsTableHeader from "./components/CloudAccountsTableHeader";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const CloudAccountsPage = () => {
  const dataTableColumns = useMemo(() => {
    return [
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
        Cloud Account Instances
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No cloud account instances"
          HeaderComponent={CloudAccountsTableHeader}
          headerProps={{}}
          isLoading={false}
        />
      </div>
    </PageContainer>
  );
};

export default CloudAccountsPage;
