import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Box } from "@mui/material";
import DataGrid, { selectSingleItem } from "components/DataGrid/DataGrid";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import formatDateUTC from "src/utils/formatDateUTC";
import DataGridHeader from "./components/DataGridHeader";
import { deleteSubscription } from "src/api/subscriptions";
import useSnackbar from "src/hooks/useSnackbar";
// import CloudProviderCell from "./components/CloudProviderCell"; - Removed for Now
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import {
  getMarketplaceProductTierRoute,
  getResourceRouteWithoutEnv,
} from "src/utils/route/access/accessRoute";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import { marketplaceServicePageTypes } from "./constants/marketplaceServicePageTypes";

const MySubscriptions = (props) => {
  const { closeSideDrawer } = props;
  const {
    data: subscriptions = [],
    isFetching,
    refetch: refetchSubscriptions,
  } = useUserSubscriptions();

  const router = useRouter();

  const { serviceId, environmentId, subscriptionId } = router.query;

  const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState({});
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectionModel, setSelectionModel] = useState([]);

  const filteredSubscriptions = useMemo(() => {
    let list = subscriptions;
    list = subscriptions?.filter((item) =>
      item?.serviceName?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
    if (typeFilter === "direct") {
      list = list?.filter((item) => item?.roleType === "root");
    } else if (typeFilter === "invited") {
      list = list?.filter((item) => item?.roleType !== "root");
    }
    return list;
  }, [searchText, typeFilter, subscriptions]);

  const snackbar = useSnackbar();

  useEffect(() => {
    if (selectionModel) {
      const subscription = filteredSubscriptions?.find(
        (item) => item.id === selectionModel[0]
      );
      setSelectedSubscription(subscription);
    }
  }, [filteredSubscriptions, selectionModel]);

  const viewResourceInstance = () => {
    if (selectedSubscription) {
      router.push(
        getResourceRouteWithoutEnv(
          selectedSubscription.serviceId,
          selectedSubscription.productTierId,
          selectedSubscription.id
        )
      );
    }
  };

  const columns = [
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
      minWidth: 230,
      renderCell: (params) => {
        const { serviceLogoURL, serviceName, serviceId, productTierId, id } =
          params.row;
        return (
          <GridCellExpand
            value={serviceName || ""}
            textStyles={{
              color: "#6941C6",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(
                getResourceRouteWithoutEnv(serviceId, productTierId, id)
              );
              closeSideDrawer();
            }}
            startIcon={
              <Box
                boxShadow="0px 1px 2px 0px #1018280D"
                borderRadius="50%"
                border="1px solid rgba(0, 0, 0, 0.08)"
                overflow="hidden"
                width="40px"
                height="40px"
                flexShrink={0}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width="38"
                  height="38"
                  style={{ objectFit: "cover" }}
                  src={
                    serviceLogoURL ||
                    "/assets/images/dashboard/service/servicePlaceholder.png"
                  }
                  alt={serviceName}
                />
              </Box>
            }
          />
        );
      },
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "productTierName",
      headerName: "Service Plan",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "roleType",
      headerName: "Role",
      flex: 1,
      minWidth: 70,
      valueGetter: (params) => {
        const role = params.row.roleType;
        if (!role?.length) {
          return "";
        }
        return role.charAt(0).toUpperCase() + role.slice(1);
      },
    },
    {
      field: "createdAt",
      headerName: "Subscription Date",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => formatDateUTC(params.row.createdAt),
    },
    {
      fieldName: "defaultSubscription",
      headerName: "Subscription Type",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) =>
        params.row.roleType === "root" ? "Direct" : "Invited",
      renderCell: (params) => {
        return (
          <GridCellExpand
            value={params.row.roleType === "root" ? "Direct" : "Invited"}
            startIcon={
              params.row.roleType === "root" ? (
                <SubscriptionTypeDirectIcon />
              ) : (
                <SubscriptionTypeInvitedIcon />
              )
            }
          />
        );
      },
    },
    {
      field: "subscriptionOwnerName",
      headerName: "Subscription Owner",
      flex: 1,
      minWidth: 120,
    },
  ];

  function handleUnsubscribeClick() {
    setShowUnsubscribeDialog(true);
  }

  const unsubsscribeFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: (values) => {
      if (values.confirmationText !== "unsubscribe") {
        return snackbar.showError("Please enter unsubscribe");
      }
      /*eslint-disable-next-line no-use-before-define*/
      unsubscribeMutation.mutate(selectedSubscription.id);
    },
  });

  const unsubscribeMutation = useMutation(deleteSubscription, {
    onSuccess: () => {
      if (subscriptionId === selectedSubscription.id) {
        router.push(
          getMarketplaceProductTierRoute(
            serviceId,
            environmentId,
            marketplaceServicePageTypes.public
          )
        );
      }
      refetchSubscriptions();
      setShowUnsubscribeDialog(false);
      unsubsscribeFormik.resetForm();
      snackbar.showSuccess("Unsubscribed Successfully");
    },
  });

  return (
    <>
      <DataGrid
        components={{
          Header: DataGridHeader,
        }}
        componentsProps={{
          header: {
            numSubscriptions: filteredSubscriptions?.length,
            searchText,
            setSearchText,
            typeFilter,
            setTypeFilter,
            viewResourceInstance,
            isFetching,
            handleRefresh: refetchSubscriptions,
            selectedSubscription: selectedSubscription,
            handleUnsubscribeClick: handleUnsubscribeClick,
            isUnsubscribing: unsubscribeMutation.isLoading,
            // serviceId: serviceId,
          },
        }}
        onSelectionModelChange={(newSelection) => {
          selectSingleItem(newSelection, selectionModel, setSelectionModel);
        }}
        loading={isFetching}
        checkboxSelection
        disableColumnMenu
        selectionModel={selectionModel}
        disableSelectionOnClick
        columns={columns}
        rows={isFetching ? [] : filteredSubscriptions}
        rowsPerPageOptions={[10]}
        pageSize={10}
        getRowId={(row) => row.id}
        sx={{
          flex: 1,
          boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
          border: "1px solid  rgba(228, 231, 236, 1)",
        }}
      />

      <TextConfirmationDialog
        open={showUnsubscribeDialog}
        handleClose={() => {
          setShowUnsubscribeDialog(false);
          unsubsscribeFormik.resetForm();
        }}
        formData={unsubsscribeFormik}
        title={`Unsubscribe Service`}
        buttonLabel={"Unsubscribe"}
        buttonColour={"red"}
        isLoading={unsubscribeMutation.isLoading}
        subtitle={`Are you sure you want to unsubscribe from ${selectedSubscription?.serviceName}?`}
        message={
          "To confirm, please enter <b>unsubscribe</b>, in the field below:"
        }
      />
    </>
  );
};

export default MySubscriptions;
