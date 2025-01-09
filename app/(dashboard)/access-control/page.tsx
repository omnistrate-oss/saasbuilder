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
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";

import useSnackbar from "src/hooks/useSnackbar";
import { revokeSubscriptionUser } from "src/api/users";

const columnHelper = createColumnHelper<any>(); // TODO: Add type
type Overlay = "delete-dialog";

const AccessControlPage = () => {
  const snackbar = useSnackbar();
  const [searchText, setSearchText] = useState<string>("");
  const [overlayType, setOverlayType] = useState<Overlay>("delete-dialog");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // TODO: Add type

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
  }, []);

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

      <InviteUsersCard />

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
          isLoading={isFetchingUsers}
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
        subtitle={`Are you sure you want to Delete ${selectedUser?.emailAddress}?`}
        message="To confirm deletion, please enter <b> deleteme </b>, in the field below:"
      />
    </PageContainer>
  );
};

export default AccessControlPage;
