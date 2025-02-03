"use client";

import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import useSnackbar from "src/hooks/useSnackbar";
import formatDateUTC from "src/utils/formatDateUTC";
import { Subscription } from "src/types/subscription";
import { deleteSubscription } from "src/api/subscriptions";
import { selectUserrootData } from "src/slices/userDataSlice";
import { useGlobalData } from "src/providers/GlobalDataProvider";

import PageTitle from "../components/Layout/PageTitle";
import PageContainer from "../components/Layout/PageContainer";
import SubscriptionDetails from "./components/SubscriptionDetails";
import SubscriptionsIcon from "../components/Icons/SubscriptionsIcon";
import ManageSubscriptionsForm from "./components/ManageSubscriptionsForm";
import SubscriptionsTableHeader from "./components/SubscriptionsTableHeader";
import FullScreenDrawer from "../components/FullScreenDrawer/FullScreenDrawer";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";

import DataTable from "components/DataTable/DataTable";
import StatusChip from "components/StatusChip/StatusChip";
import DataGridText from "components/DataGrid/DataGridText";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import SubscriptionTypeDirectIcon from "components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";

const columnHelper = createColumnHelper<Subscription>();
type Overlay =
  | "manage-subscriptions"
  | "unsubscribe-dialog"
  | "subscription-details";

const SubscriptionsPage = () => {
  const snackbar = useSnackbar();
  const searchParams = useSearchParams();

  const serviceId = searchParams?.get("serviceId");
  const servicePlanId = searchParams?.get("servicePlanId");

  const [searchText, setSearchText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "manage-subscriptions"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [clickedSubscription, setClickedSubscription] =
    useState<Subscription | null>(null);

  const selectUser = useSelector(selectUserrootData);
  const {
    subscriptions,
    isFetchingSubscriptions,
    refetchSubscriptions,
    serviceOfferingsObj,
    isFetchingServiceOfferings,
  } = useGlobalData();

  useEffect(() => {
    if (serviceId && servicePlanId) {
      setIsOverlayOpen(true);
      setOverlayType("manage-subscriptions");
    }
  }, [
    serviceId,
    servicePlanId,
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
  ]);

  // Show only subscriptions that have service offerings associated with them
  const existingSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (sub) => serviceOfferingsObj[sub.serviceId]?.[sub.productTierId]
    );
  }, [serviceOfferingsObj, subscriptions]);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "Subscription ID",
        cell: (data) => {
          return (
            <DataGridText
              color="primary"
              onClick={() => {
                setClickedSubscription(data.row.original);
                setIsOverlayOpen(true);
                setOverlayType("subscription-details");
              }}
              style={{
                display: "block",
                minWidth: "130px",
                fontWeight: 600,
              }}
              showCopyButton
            >
              {data.row.original.id}
            </DataGridText>
          );
        },
        meta: {
          minWidth: 230,
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

  const filteredSubscriptions = useMemo(() => {
    return existingSubscriptions.filter((sub) => {
      return sub.serviceName.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [searchText, existingSubscriptions]);

  return (
    <div>
      <AccountManagementHeader
        userName={selectUser?.name}
        userEmail={selectUser?.email}
      />
      <PageContainer>
        <PageTitle icon={SubscriptionsIcon} className="mb-6">
          Subscriptions
        </PageTitle>

        <div>
          <DataTable
            columns={dataTableColumns}
            rows={filteredSubscriptions}
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
              count: existingSubscriptions?.length,
              isFetchingSubscriptions,
              refetchSubscriptions,
              selectedSubscription,
            }}
            isLoading={isFetchingSubscriptions || isFetchingServiceOfferings}
            selectionMode="single"
            selectedRows={selectedRows}
            onRowSelectionChange={setSelectedRows}
            rowId="id"
          />
        </div>

        <FullScreenDrawer
          open={
            isOverlayOpen &&
            (overlayType === "manage-subscriptions" ||
              overlayType === "subscription-details")
          }
          closeDrawer={() => setIsOverlayOpen(false)}
          title={
            overlayType === "manage-subscriptions"
              ? "Manage Subscriptions"
              : "Subscription Details"
          }
          description={
            overlayType === "manage-subscriptions"
              ? "Add or remove subscriptions"
              : "View subscription details"
          }
          RenderUI={
            overlayType === "manage-subscriptions" ? (
              <ManageSubscriptionsForm
                defaultServiceId={serviceId}
                defaultServicePlanId={servicePlanId}
                isFetchingServiceOfferings={isFetchingServiceOfferings}
              />
            ) : (
              <SubscriptionDetails
                subscription={clickedSubscription}
                serviceOfferingsObj={serviceOfferingsObj}
              />
            )
          }
        />

        <TextConfirmationDialog
          open={isOverlayOpen && overlayType === "unsubscribe-dialog"}
          handleClose={() => setIsOverlayOpen(false)}
          onConfirm={async () => {
            if (!selectedSubscription) {
              return snackbar.showError("Please select a subscription");
            }
            await unSubscribeMutation.mutateAsync(selectedSubscription.id);
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
