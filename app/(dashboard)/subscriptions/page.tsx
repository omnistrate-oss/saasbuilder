"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import useSnackbar from "src/hooks/useSnackbar";
import formatDateUTC from "src/utils/formatDateUTC";
import { deleteSubscription } from "src/api/subscriptions";
import { selectUserrootData } from "src/slices/userDataSlice";
import { useGlobalDataContext } from "src/providers/GlobalDataProvider";

import PageTitle from "../components/Layout/PageTitle";
import SettingsIcon from "../components/Icons/SettingsIcon";
import PageContainer from "../components/Layout/PageContainer";
import ManageSubscriptionsForm from "./components/ManageSubscriptionsForm";
import SubscriptionsTableHeader from "./components/SubscriptionsTableHeader";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";

import DataTable from "components/DataTable/DataTable";
import StatusChip from "components/StatusChip/StatusChip";
import DataGridText from "components/DataGrid/DataGridText";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import SideDrawerRight from "components/SideDrawerRight/SideDrawerRight";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import SubscriptionTypeDirectIcon from "components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";

const columnHelper = createColumnHelper<any>(); // TODO: Add type
type Overlay = "manage-subscriptions" | "unsubscribe-dialog";

const SubscriptionsPage = () => {
  const snackbar = useSnackbar();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "manage-subscriptions"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const selectUser = useSelector(selectUserrootData);
  const { subscriptions, isFetchingSubscriptions, refetchSubscriptions } =
    useGlobalDataContext();

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "Subscription ID",
        cell: (data) => {
          return (
            <DataGridText color="primary">{data.row.original.id}</DataGridText>
          );
        },
      }),
      columnHelper.accessor("roleType", {
        id: "roleType",
        header: "Role",
        cell: (data) => {
          const role = data.row.original.roleType;
          return role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";
        },
        meta: {
          flex: 0.7,
          minWidth: 80,
        },
      }),
      columnHelper.accessor("serviceName", {
        id: "serviceName",
        header: "Service Name",
        cell: (data) => {
          const { serviceName, serviceLogoURL } = data.row.original;
          return (
            <ServiceNameWithLogo
              serviceName={serviceName}
              serviceLogoURL={serviceLogoURL}
            />
          );
        },
        meta: {
          minWidth: 230,
        },
      }),
      columnHelper.accessor("productTierName", {
        id: "productTierName",
        header: "Service Plan",
        cell: (data) => {
          return data.row.original.productTierName || "-";
        },
      }),
      columnHelper.accessor("status", {
        id: "status",
        header: "Status",
        cell: (data) => {
          return <StatusChip status={data.row.original.status} />;
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
      columnHelper.accessor("subscriptionOwnerName", {
        id: "subscriptionOwnerName",
        header: "Subscription Owner",
        cell: (data) => {
          return (
            <GridCellExpand
              value={data.row.original.subscriptionOwnerName}
              startIcon={
                data.row.original.roleType === "root" ? (
                  <SubscriptionTypeDirectIcon />
                ) : (
                  <SubscriptionTypeInvitedIcon />
                )
              }
            />
          );
        },
      }),
    ];
  }, []);

  const selectedSubscription = useMemo(() => {
    return subscriptions.find(
      (subscription) => subscription.id === selectedRows[0]
    );
  }, [selectedRows, subscriptions]);

  const unSubscribeMutation = useMutation(deleteSubscription, {
    onSuccess: () => {
      refetchSubscriptions();
      setIsOverlayOpen(false);
      snackbar.showSuccess("Unsubscribed successfully");
    },
  });

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
            headerProps={{
              selectedRows,
              searchText,
              setSearchText,
              onManageSubscriptions: () => {
                setIsOverlayOpen(true);
                setOverlayType("manage-subscriptions");
              },
              onUnsubscribe: () => {
                setIsOverlayOpen(true);
                setOverlayType("unsubscribe-dialog");
              },
              isUnsubscribing: unSubscribeMutation.isLoading,
              subscriptions,
              isFetchingSubscriptions,
              refetchSubscriptions,
              selectedSubscription,
            }}
            isLoading={isFetchingSubscriptions}
            selectionMode="single"
            selectedRows={selectedRows}
            onRowSelectionChange={setSelectedRows}
            rowId="id"
          />
        </div>

        <SideDrawerRight
          size="xlarge"
          open={isOverlayOpen && overlayType === "manage-subscriptions"}
          closeDrawer={() => setIsOverlayOpen(false)}
          RenderUI={<ManageSubscriptionsForm />}
        />

        <TextConfirmationDialog
          open={isOverlayOpen && overlayType === "unsubscribe-dialog"}
          handleClose={() => setIsOverlayOpen(false)}
          onConfirm={() => {
            if (!selectedSubscription) {
              return snackbar.showError("Please select a subscription");
            }
            unSubscribeMutation.mutate(selectedSubscription.id);
          }}
          confirmationText="unsubscribe"
          title="Unsubscribe Service"
          buttonLabel="Unsubscribe"
          isLoading={unSubscribeMutation.isLoading}
          subtitle={`Are you sure you want to unsubscribe from ${selectedSubscription?.serviceName}?`}
          message="To confirm, please enter <b>unsubscribe</b>, in the field below:"
        />
      </PageContainer>
    </div>
  );
};

export default SubscriptionsPage;
