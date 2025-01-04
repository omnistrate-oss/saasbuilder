"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import PageTitle from "../components/Layout/PageTitle";
import InviteUsersCard from "./components/InviteUsersCard";
import PageContainer from "../components/Layout/PageContainer";
import AccessControlIcon from "../components/Icons/AccessControlIcon";

import DataTable from "src/components/DataTable/DataTable";
import AccessControlTableHeader from "./components/AccessControlTableHeader";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const AccessControlPage = () => {
  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("name", {
        id: "name",
        header: "Name",
        meta: {
          minWidth: 200,
        },
      }),
      columnHelper.accessor("emailAddress", {
        id: "emailAddress",
        header: "Email Address",
        meta: {
          minWidth: 200,
        },
      }),
      columnHelper.accessor("role", {
        id: "role",
        header: "Role",
        cell: (data) => {
          const role = data.row.original.role;
          return role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";
        },
        meta: {
          minWidth: 100,
        },
      }),
    ];
  }, []);

  return (
    <PageContainer>
      <PageTitle icon={AccessControlIcon} className="mb-6">
        Access Control
      </PageTitle>

      <InviteUsersCard />

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No users"
          HeaderComponent={AccessControlTableHeader}
          headerProps={{}}
          isLoading={false}
        />
      </div>
    </PageContainer>
  );
};

export default AccessControlPage;
