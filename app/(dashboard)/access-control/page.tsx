"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import useAllUsers from "./hooks/useAllUsers";
import PageTitle from "../components/Layout/PageTitle";
import InviteUsersCard from "./components/InviteUsersCard";
import PageContainer from "../components/Layout/PageContainer";
import AccessControlIcon from "../components/Icons/AccessControlIcon";
import AccessControlTableHeader from "./components/AccessControlTableHeader";

import Button from "components/Button/Button";
import DataTable from "components/DataTable/DataTable";
import DeleteIcon from "components/Icons/Delete/Delete";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import SubscriptionTypeDirectIcon from "components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";

import useSnackbar from "src/hooks/useSnackbar";
import { revokeSubscriptionUser } from "src/api/users";
import { useGlobalData } from "src/providers/GlobalDataProvider";

const columnHelper = createColumnHelper<any>(); // TODO: Add type
type Overlay = "delete-dialog";

const AccessControlPage = () => {
  const snackbar = useSnackbar();
  const [searchText, setSearchText] = useState<string>("");
  const [overlayType, setOverlayType] = useState<Overlay>("delete-dialog");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // TODO: Add type
  const { subscriptions, isFetchingSubscriptions } = useGlobalData();

  const subscriptionsObj = useMemo(() => {
    return subscriptions.reduce((acc: any, sub: any) => {
      acc[sub.id] = sub;
      return acc;
    }, {});
  }, [subscriptions]);

  const {
    data: users = [],
    isFetching: isFetchingUsers,
    refetch: refetchUsers,
  } = useAllUsers();

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("name", {
        id: "name",
        header: "Name",
        meta: {
          minWidth: 200,
        },
      }),
      columnHelper.accessor("email", {
        id: "email",
        header: "Email Address",
        meta: {
          minWidth: 200,
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
          minWidth: 100,
        },
      }),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId];
          return subscription?.serviceName;
        },
        {
          id: "serviceName",
          header: "Service Name",
          cell: (data) => {
            const { serviceLogoURL, serviceName } =
              subscriptionsObj[data.row.original.subscriptionId] || {};
            return (
              <ServiceNameWithLogo
                serviceName={serviceName}
                serviceLogoURL={serviceLogoURL}
              />
            );
          },
        }
      ),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId];
          return subscription?.productTierName || "-";
        },
        {
          id: "servicePlanName",
          header: "Subscription Plan",
        }
      ),
      columnHelper.accessor("subscriptionOwnerName", {
        id: "subscriptionOwnerName",
        header: "Subscription Owner",
        cell: (data) => {
          const subscription =
            subscriptionsObj[data.row.original.subscriptionId];

          return (
            <GridCellExpand
              value={subscription?.subscriptionOwnerName}
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
      columnHelper.accessor("action", {
        id: "action",
        header: "Action",
        cell: (data) => {
          return data.row.original.roleType !== "root" ? (
            <Button
              variant="outlined"
              fontColor="#B42318"
              onClick={() => {
                setIsOverlayOpen(true);
                setOverlayType("delete-dialog");
                setSelectedUser(data.row.original);
              }}
              startIcon={<DeleteIcon color="#B42318" />}
              sx={{
                border: "none !important",
                padding: "0px !important",
                boxShadow: "none !important",
              }}
              disableRipple
            >
              Delete User
            </Button>
          ) : null;
        },
        meta: {
          minWidth: 200,
        },
      }),
    ];
  }, [subscriptionsObj]);

  const deleteUserMutation = useMutation(
    (payload: any) => revokeSubscriptionUser(payload.subscriptionId, payload),
    {
      onSuccess: async () => {
        refetchUsers();
        setIsOverlayOpen(false);
        snackbar.showSuccess("User deleted successfully");
      },
    }
  );

  const filteredUsers = useMemo(() => {
    let res = users || [];

    if (searchText) {
      const searchTerm = searchText.toLowerCase();

      res = res.filter((user: any) => {
        return (
          user.name.toLowerCase().includes(searchTerm) ||
          user.emailAddress.toLowerCase().includes(searchTerm) ||
          user.id.toLowerCase().includes(searchTerm)
        );
      });
    }

    return res;
  }, [users, searchText]);

  return (
    <PageContainer>
      <PageTitle icon={AccessControlIcon} className="mb-6">
        Access Control
      </PageTitle>

      <InviteUsersCard
        refetchUsers={refetchUsers}
        isFetchingUsers={isFetchingUsers}
      />

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={filteredUsers}
          noRowsText="No users"
          HeaderComponent={AccessControlTableHeader}
          headerProps={{
            searchText,
            setSearchText,
            refetchUsers,
            count: users.length,
            isFetchingUsers,
          }}
          isLoading={isFetchingUsers || isFetchingSubscriptions}
        />
      </div>

      <TextConfirmationDialog
        open={isOverlayOpen && overlayType === "delete-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        onConfirm={async () => {
          if (!selectedUser) return snackbar.showError("No user selected");

          const payload = {
            email: selectedUser.email,
            roleType: selectedUser.roleType,
            subscriptionId: selectedUser.subscriptionId,
          };
          deleteUserMutation.mutate(payload);
        }}
        title="Delete User"
        isLoading={deleteUserMutation.isLoading}
        subtitle={`Are you sure you want to delete ${selectedUser?.email}?`}
        message="To confirm deletion, please enter <b> deleteme </b>, in the field below:"
      />
    </PageContainer>
  );
};

export default AccessControlPage;
