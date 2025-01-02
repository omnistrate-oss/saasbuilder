"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";

import formatDateUTC from "src/utils/formatDateUTC";
import DataTable from "src/components/DataTable/DataTable";
import { selectUserrootData } from "src/slices/userDataSlice";

import PageTitle from "../components/Layout/PageTitle";
import SettingsIcon from "../components/Icons/SettingsIcon";
import PageContainer from "../components/Layout/PageContainer";
import SubscriptionsTableHeader from "./components/SubscriptionsTableHeader";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import { useGlobalDataContext } from "src/providers/GlobalDataProvider";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const SubscriptionsPage = () => {
  const { subscriptions, isFetchingSubscriptions } = useGlobalDataContext();
  const selectUser = useSelector(selectUserrootData);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("roleType", {
        id: "roleType",
        header: "Role",
        cell: (data) => {
          const role = data.row.original.roleType;
          return role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";
        },
        meta: {
          minWidth: 80,
        },
      }),
      columnHelper.accessor("productTierName", {
        id: "productTierName",
        header: "Service Plan",
        cell: (data) => {
          return data.row.original.productTierName || "-";
        },
        meta: {
          minWidth: 150,
        },
      }),
      columnHelper.accessor((row) => formatDateUTC(row.createdAt), {
        id: "createdAt",
        header: "Subscription Date",
        cell: (data) =>
          data.row.original.createdAt
            ? formatDateUTC(data.row.original.createdAt)
            : "-",
      }),
    ];
  }, []);

  return (
    <div>
      <AccountManagementHeader
        userName={selectUser?.name}
        userEmail={selectUser?.email}
      />
      <PageContainer>
        <PageTitle icon={SettingsIcon} className="mb-6">
          Subscriptions
        </PageTitle>

        <div>
          <DataTable
            columns={dataTableColumns}
            rows={subscriptions}
            noRowsText="No subscriptions"
            HeaderComponent={SubscriptionsTableHeader}
            headerProps={{}}
            isLoading={isFetchingSubscriptions}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default SubscriptionsPage;
