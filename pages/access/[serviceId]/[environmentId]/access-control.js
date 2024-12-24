import AddIcon from "@mui/icons-material/Add";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../../../src/components/Button/Button";
import DashboardLayout from "../../../../src/components/DashboardLayout/DashboardLayout";
import Form from "../../../../src/components/FormElements/Form/Form";
import useSnackbar from "../../../../src/hooks/useSnackbar";
import LoadingSpinnerSmall from "../../../../src/components/CircularProgress/CircularProgress";
import { useRouter } from "next/router";
import { RiDeleteBinLine } from "react-icons/ri";
import { AccessSupport } from "../../../../src/components/Access/AccessSupport";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "../../../../src/hooks/useServiceOffering";
import SideDrawerRight from "../../../../src/components/SideDrawerRight/SideDrawerRight";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../../../src/utils/isAllowedByRBAC";
import ConfirmationDialog from "../../../../src/components/Dialog/ConfirmDialog";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "../../../../src/utils/route/access/accessRoute";
import { inviteSubscriptionUser, revokeSubscriptionUser } from "src/api/users";
import useSubscriptionUsers from "src/hooks/query/useSubscriptionUsers";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import ServiceOfferingUnavailableUI from "src/components/ServiceOfferingUnavailableUI/ServiceOfferingUnavailableUI";
import LogoHeader from "src/components/Headers/LogoHeader";
import AccessControlIcon from "src/components/Icons/AccessControlIcon/AccessControlIcon";
import { Text } from "src/components/Typography/Typography";
import DataGrid from "src/components/DataGrid/DataGrid";
import AccessControlHeader from "src/components/Access/AccessControl/AccessControlHeader";
import Select from "src/components/FormElementsv2/Select/Select";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function AccessControl() {
  const router = useRouter();
  const {
    serviceId,
    environmentId,
    source,
    productTierId,
    subscriptionId,
    searchUserId,
  } = router.query;

  const snackbar = useSnackbar();

  const { data: service, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  const {
    data,
    isFetching: isFetchingUsers,
    refetch,
  } = useSubscriptionUsers({
    subscriptionId: subscriptionData?.id,
  });
  const { subscriptionUsers: users = [] } = data || {};
  const [searchText, setSearchText] = useState("");
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [modifyFormikValue, setModifyFormikValue] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const [isDialog, setDialog] = React.useState(false);

  const role = getEnumFromUserRoleString(subscriptionData?.roleType);
  const view = viewEnum.Access_AccessControl;
  const unviteAllowed = isOperationAllowedByRBAC(
    operationEnum.UnInvite,
    role,
    view
  );
  const inviteAllowed = isOperationAllowedByRBAC(
    operationEnum.Invite,
    role,
    view
  );
  const [currentSource, setCurrentSource] = React.useState("");
  const handleClose = () => {
    setDialog(false);
  };
  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  useEffect(() => {
    if (searchUserId) {
      setSearchText(searchUserId);
    }
  }, [searchUserId]);

  const createUserInvitesMutation = useMutation(
    async (data) => {
      return Promise.all(
        data.userInvite.map((d) => {
          const payload = {
            email: d.email,
            roleType: d.roleType,
          };

          return inviteSubscriptionUser(subscriptionData?.id, payload, true);
        })
      );
    },
    {
      onSuccess: () => {
        snackbar.showSuccess(
          "Invitations sent successfully! If the user doesn't see the email, remind them to check their spam folder"
        );
        //eslint-disable-next-line no-use-before-define
        formik.resetForm();
        refetch();
      },
      onError: (error) => {
        refetch();
        const backendErrorMessage = error?.response?.data?.message;
        snackbar.showError(
          <>
            Some invites were not sent. Please retry
            {backendErrorMessage ? (
              <>
                <br />
                Error details: {backendErrorMessage}{" "}
              </>
            ) : (
              ""
            )}
          </>
        );
      },
    }
  );

  const deleteUserMutation = useMutation(
    (payload) => revokeSubscriptionUser(subscriptionData?.id, payload),
    {
      onSuccess: async () => {
        //eslint-disable-next-line no-use-before-define
        deleteformik.resetForm();
        setDialog(false);
        snackbar.showSuccess("User Deleted");
        refetch();
      },
      onError: (error) => {
        console.error(error);
        snackbar.showError("Failed to delete user");
      },
    }
  );

  const deleteformik = useFormik({
    initialValues: {
      deleteme: "",
    },
    onSubmit: (values) => {
      if (values.deleteme === "deleteme") {
        const payload = {
          email: modifyFormikValue.emailAddress,
          roleType: modifyFormikValue.role,
        };
        deleteUserMutation.mutate(payload);
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const formik = useFormik({
    initialValues: {
      userInvite: [
        {
          email: "",
          roleType: "",
          serviceId: "All",
          serviceEnvironmentId: "All",
        },
      ],
    },
    onSubmit: (values) => {
      const valuesToBeSubmitted = structuredClone(values);

      for (let i = 0; i < valuesToBeSubmitted?.userInvite?.length; i++) {
        if (valuesToBeSubmitted.userInvite[i]["roleType"] === "Editor") {
          valuesToBeSubmitted.userInvite[i]["roleType"] = "editor";
        }
        if (valuesToBeSubmitted.userInvite[i]["roleType"] === "Reader") {
          valuesToBeSubmitted.userInvite[i]["roleType"] = "reader";
        }
      }
      createUserInvitesMutation.mutate(valuesToBeSubmitted);
    },
    validateOnChange: false,
  });

  const inputColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      valueGetter: (params) => {
        const role = params.row.role;
        if (role === "editor") {
          return "Editor";
        }
        if (role === "reader") {
          return "Reader";
        }
        if (role === "root") {
          return "Root";
        }
      },
    },
    {
      field: "resource",
      headerName: "Resource",
      flex: 1,
    },
    {
      field: "resourceInstance",
      headerName: "Resource Instance",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const role = params.row.role;
        if (role !== "root") {
          return (
            <IconButton
              size="small"
              disabled={!unviteAllowed}
              onClick={() => {
                setDialog(true);
              }}
            >
              <RiDeleteBinLine />
            </IconButton>
          );
        } else return "";
      },
    },
  ];

  const inputRows = users.map((data) => {
    return {
      id: data.userId,
      name: data.name ? data.name : "Unregistered User",
      role: data.roleType,
      emailAddress: data.email,
      resource: "All",
      resourceInstance: "All",
    };
  });

  const getNewEnvVariable = () => {
    return {
      email: "",
      roleType: "",
      serviceId: "All",
      serviceEnvironmentId: "All",
    };
  };
  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource
  );

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
    subscriptionData?.id
  );

  const isCustomNetworkEnabled = useMemo(() => {
    let enabled = false;

    if (
      service?.serviceModelFeatures?.find((featureObj) => {
        return featureObj.feature === "CUSTOM_NETWORKS";
      })
    )
      enabled = true;

    return enabled;
  }, [service]);

  const filteredUsers = useMemo(() => {
    let users = inputRows || [];

    if (searchText) {
      const searchTerm = searchText.toLowerCase();

      users = users.filter((user) => {
        return (
          user.name.toLowerCase().includes(searchTerm) ||
          user.emailAddress.toLowerCase().includes(searchTerm) ||
          user.id.toLowerCase().includes(searchTerm)
        );
      });
    }

    return users;
  }, [inputRows, searchText]);

  if (isServiceOfferingLoading || isLoadingSubscription || !service) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        apiDocsurl={serviceAPIDocsLink}
        serviceId={serviceId}
        environmentId={environmentId}
        accessPage
        customLogo
        serviceApiId={service?.serviceAPIID}
        enableConsumptionLinks
        servicePlanUrlLink={servicePlanUrlLink}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={service?.serviceName}
            active={sidebarActiveOptions.accessControl}
            productTierId={productTierId}
            currentSource={currentSource}
            subscriptionId={subscriptionData?.id}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={service?.serviceName}
        serviceLogoURL={service?.serviceLogoURL}
        pageType={sidebarActiveOptions.accessControl}
      >
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!isLoadingSubscription && !subscriptionData?.id) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        apiDocsurl={serviceAPIDocsLink}
        serviceId={serviceId}
        accessPage
        customLogo
        serviceApiId={service?.serviceAPIID}
        enableConsumptionLinks
        servicePlanUrlLink={servicePlanUrlLink}
        environmentId={environmentId}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={service?.serviceName}
            active={sidebarActiveOptions.accessControl}
            productTierId={productTierId}
            currentSource={currentSource}
            subscriptionId={subscriptionData?.id}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={service?.serviceName}
        serviceLogoURL={service?.serviceLogoURL}
        pageType={sidebarActiveOptions.accessControl}
      >
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }

  //handle the case of when someone tries to access the service w/o releasing
  if (service?.notAvailable || service?.serviceModelStatus === "DEPLOYING") {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        accessPage
        currentSubscription={subscriptionData}
        isCustomNetworkEnabled={isCustomNetworkEnabled}
        environmentId={environmentId}
        pageType={sidebarActiveOptions.accessControl}
      >
        <ServiceOfferingUnavailableUI />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      setSupportDrawerOpen={setSupportDrawerOpen}
      setCurrentTabValue={setCurrentTabValue}
      marketplacePage={currentSource === "access" ? false : true}
      accessPage
      currentSubscription={subscriptionData}
      apiDocsurl={serviceAPIDocsLink}
      serviceId={serviceId}
      serviceApiId={service?.serviceAPIID}
      enableConsumptionLinks
      servicePlanUrlLink={servicePlanUrlLink}
      environmentId={environmentId}
      isNotShow
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={service?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={service?.serviceName}
          active={sidebarActiveOptions.accessControl}
          productTierId={productTierId}
          currentSource={currentSource}
          currentSubscription={subscriptionData}
          isCustomNetworkEnabled={isCustomNetworkEnabled}
        />
      }
      serviceName={service?.serviceName}
      customLogo
      serviceLogoURL={service?.serviceLogoURL}
      pageType={sidebarActiveOptions.accessControl}
    >
      {isFetchingUsers || isLoadingSubscription ? (
        <Box display="flex" justifyContent="center" mt="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            //@ts-ignore
            justifyContent="flex-start"
            paddingBottom={"32px"}
          >
            <Box paddingTop={"5px"}>
              <AccessControlIcon />
            </Box>
            <LogoHeader
              margin={0}
              title={"Access Control"}
              desc="Manage your Users and their account permissions here."
            />
          </Box>

          <Box
            mb="32px"
            boxShadow="0 1px 2px 0 #1018280F"
            borderRadius="12px 12px 12px 12px"
            border="1px solid #EAECF0"
          >
            <Form
              onSubmit={formik.handleSubmit}
              sx={{
                padding: "20px 24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Text size="large">Invite Users</Text>
                  <Text size="small" weight="regular" color="#475467" mt="4px">
                    Get your projects up and running faster by inviting your
                    users to collaborate
                  </Text>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    marginLeft: "30px",
                    marginRight: "30px",
                  }}
                  startIcon={<EmailOutlinedIcon />}
                  type="submit"
                  disabled={
                    createUserInvitesMutation.isLoading ? true : !inviteAllowed
                  }
                >
                  Send Invites{" "}
                  {createUserInvitesMutation.isLoading && (
                    <LoadingSpinnerSmall />
                  )}
                </Button>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ maxWidth: "1100px" }}>
                  <FormikProvider value={formik}>
                    <FieldArray
                      name="userInvite"
                      render={({ remove, push }) => {
                        return (
                          <>
                            {formik.values.userInvite.map((invite, index) => {
                              return (
                                <Box
                                  display={"flex"}
                                  flex={1}
                                  key={index}
                                  sx={{ marginTop: "8px" }}
                                  columnGap={"15px"}
                                  rowGap={"15px"}
                                  justifyContent={"flex-start"}
                                  alignItems={"center"}
                                  pb={2}
                                >
                                  <Box
                                    display={"flex"}
                                    columnGap={"15px"}
                                    rowGap={"15px"}
                                    flexWrap={"wrap"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                  >
                                    <TextField
                                      required
                                      placeholder="you@example.com"
                                      value={invite.email}
                                      onChange={formik.handleChange}
                                      name={`userInvite[${index}].email`}
                                      sx={{ width: "400px", flex: 1 }}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment
                                            position="start"
                                            sx={{
                                              marginRight: "0px",
                                              paddingRight: "0px !important",
                                              borderLeft: "none !important",
                                              "& .MuiIconButton-root": {
                                                padding: 0,
                                              },
                                            }}
                                          >
                                            <IconButton>
                                              <EmailOutlinedIcon />
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                    <Select
                                      required
                                      displayEmpty
                                      name={`userInvite[${index}].roleType`}
                                      value={invite.roleType}
                                      onChange={formik.handleChange}
                                      sx={{ width: "400px", flex: 1 }}
                                      renderValue={(value) => value || "Role"}
                                    >
                                      {["Editor", "Reader"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Box>
                                  <Box
                                    sx={{
                                      visibility:
                                        index === 0 ? "hidden" : "visible",
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        remove(index);
                                      }}
                                    >
                                      <RiDeleteBinLine />
                                    </IconButton>
                                  </Box>
                                </Box>
                              );
                            })}
                            <Stack
                              direction="row"
                              justifyContent={
                                formik.values.userInvite.length > 0
                                  ? "space-between"
                                  : "flex-end"
                              }
                              marginBottom={"20px"}
                            >
                              {formik.values.userInvite.length === 0 ? (
                                <Button
                                  startIcon={<AddIcon />}
                                  // variant="contained"
                                  id="add-user"
                                  sx={{
                                    marginTop: "16px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                    background: "white",
                                    color: "black",
                                    opacity: 0.8,
                                  }}
                                  onClick={() => {
                                    push(getNewEnvVariable());
                                  }}
                                >
                                  Add User
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    startIcon={<AddIcon />}
                                    id="add-another-user"
                                    sx={{
                                      marginTop: "16px",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      background: "white",
                                      color: "black",
                                      opacity: 0.8,
                                    }}
                                    onClick={() => {
                                      push(getNewEnvVariable());
                                    }}
                                  >
                                    Add Another
                                  </Button>
                                </>
                              )}
                            </Stack>
                          </>
                        );
                      }}
                    />
                  </FormikProvider>
                </Box>
              </Box>
            </Form>
          </Box>

          <Box mt="20px">
            <DataGrid
              rows={filteredUsers}
              columns={inputColumns}
              components={{
                Header: AccessControlHeader,
              }}
              componentsProps={{
                header: {
                  count: filteredUsers.length,
                  searchText: searchText,
                  setSearchText: setSearchText,
                },
              }}
              selectionModel={selectionModel}
              onSelectionModelChange={(selection) => {
                setSelectionModel(selection);
                if (selection.length > 0) {
                  const selectedUser = filteredUsers.find(
                    (user) => user.id === selection[selection.length - 1]
                  );
                  if (selectedUser) setModifyFormikValue(selectedUser);
                }
              }}
              getRowId={(row) => row.id}
              noRowsText="No users"
            />
          </Box>
        </>
      )}

      <ConfirmationDialog
        open={isDialog}
        handleClose={handleClose}
        formData={deleteformik}
        title={`Delete User`}
        buttonLabel={"Delete"}
        buttonColour={"#D92D20"}
        subtitle={`Are you sure you want to Delete ${modifyFormikValue.emailAddress}?`}
        message={
          "To confirm deletion, please enter <b> deleteme </b>, in the field below:"
        }
        isLoading={deleteUserMutation.isLoading}
      />
      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport service={service} currentTabValue={currentTabValue} />
        }
      />
    </DashboardLayout>
  );
}

export default AccessControl;
