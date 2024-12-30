import { SxProps, styled, Theme, Stack, Box } from "@mui/material";
import MuiTableCell from "@mui/material/TableCell";
import { Text } from "src/components/Typography/Typography";
import { FC, useEffect, useRef, useState } from "react";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import Button from "src/components/Button/Button";
import { useFormik } from "formik";
import {
  addCustomDNSToResourceInstance,
  removeCustomDNSFromResourceInstance,
  getResourceInstanceDetails,
} from "src/api/resourceInstance";

import * as Yup from "yup";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";
import IconButtonSquare from "src/components/IconButtonSquare/IconButtonSquare";
import EditIcon from "src/components/Icons/Edit/Edit";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import TextConfirmationDialog from "src/components/TextConfirmationDialog/TextConfirmationDialog";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import CustomDNSDetailsModal from "./CustomDNSDetailsModal";
import { getCustomDNSStatusStylesAndLabel } from "src/constants/statusChipStyles/customDNS";
import { useMutation } from "@tanstack/react-query";
import ViewInstructionsIcon from "src/components/Icons/AccountConfig/ViewInstrcutionsIcon";
import Card from "src/components/Card/Card";
import PublicIcon from "src/components/Icons/DNSIcon/PublicIcon";

export type AddCustomDNSToResourceInstancePayload = {
  customDNS: string;
  targetPort?: number;
};
const TableCell = styled(MuiTableCell)({
  borderBottom: "none",
});

type ResourceConnectivityEndpointProps = {
  containerStyles: SxProps<Theme>;
  resourceKey: string;
  resourceId: string;
  resourceHasCompute: boolean;
  resourceName: string;
  customDNSData?: {
    enabled: boolean;
    dnsName?: string;
    status?: string;
    cnameTarget?: string;
    aRecordTarget?: string;
  };
  queryData: {
    serviceProviderId: string;
    serviceKey: string;
    serviceAPIVersion: string;
    serviceEnvironmentKey: string;
    serviceModelKey: string;
    productTierKey: string;
    subscriptionId: string;
    resourceInstanceId: string;
  };
  refetchInstance: () => void;
};

const ResourceConnectivityCustomDNS: FC<ResourceConnectivityEndpointProps> = (
  props
) => {
  const {
    customDNSData = { enabled: false },
    queryData,
    resourceKey,
    resourceId,
    refetchInstance,
    resourceHasCompute,
    resourceName,
  } = props;

  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [showConfigurationDialog, setShowConfigurationDialog] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isTextfieldDisabled, setIsTextFieldDisabled] = useState(false);
  const [shouldShowConfigDialog, setShouldShowConfigDialog] = useState(false);
  const [isVerifyingDNSRemoval, setIsVerifyingDNSRemoval] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textfieldRef = useRef<HTMLInputElement>();
  const timeoutID = useRef(null);
  const pollCount = useRef(0);

  const { dnsName } = customDNSData;
  let isCustomDNSSetup = false;
  if (dnsName) {
    isCustomDNSSetup = true;
  }
  const [isToggleChecked, setIsToggleChecked] = useState(isCustomDNSSetup);

  const addCustomDNSMutation = useMutation({
    mutationFn: (payload: AddCustomDNSToResourceInstancePayload) => {
      return addCustomDNSToResourceInstance(
        queryData.serviceProviderId,
        queryData.serviceKey,
        queryData.serviceAPIVersion,
        queryData.serviceEnvironmentKey,
        queryData.serviceModelKey,
        queryData.productTierKey,
        resourceKey,
        queryData.resourceInstanceId,
        queryData.subscriptionId,
        payload
      );
    },
    onSuccess: () => {
      refetchInstance();
    },
  });

  const removeCustomDNSMutation = useMutation({
    mutationFn: () => {
      return removeCustomDNSFromResourceInstance(
        queryData.serviceProviderId,
        queryData.serviceKey,
        queryData.serviceAPIVersion,
        queryData.serviceEnvironmentKey,
        queryData.serviceModelKey,
        queryData.productTierKey,
        resourceKey,
        queryData.resourceInstanceId,
        queryData.subscriptionId
      );
    },
    onSuccess: () => {
      pollInstanceQueryToVerifyDNSRemoval();
    },
  });

  function clearExistingTimeout() {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
  }

  function pollInstanceQueryToVerifyDNSRemoval() {
    setIsVerifyingDNSRemoval(true);
    clearExistingTimeout();
    pollCount.current = 0;
    verifyDNSRemoval();

    function verifyDNSRemoval() {
      if (pollCount.current < 5) {
        pollCount.current++;
        const id = setTimeout(() => {
          getResourceInstanceDetails(
            queryData.serviceProviderId,
            queryData.serviceKey,
            queryData.serviceAPIVersion,
            queryData.serviceEnvironmentKey,
            queryData.serviceModelKey,
            queryData.productTierKey,
            resourceKey,
            queryData.resourceInstanceId,
            queryData.subscriptionId
          )
            .then((response) => {
              const topologyDetails =
                response.data?.detailedNetworkTopology?.[resourceId];
              //check for dnsName field in the response, absence means dns removal complete
              if (!Boolean(topologyDetails?.customDNSEndpoint.dnsName)) {
                setIsVerifyingDNSRemoval(false);
                refetchInstance();
              } else {
                verifyDNSRemoval();
              }
            })
            .catch(() => {
              verifyDNSRemoval();
            });
        }, 1500);
        timeoutID.current = id;
      } else {
        setIsVerifyingDNSRemoval(false);
      }
    }
  }

  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, []);

  const customDNSFormik = useFormik({
    initialValues: {
      customDNSEndpoint: dnsName ?? "",
    },
    onSubmit: (values) => {
      handleAddDNS({
        customDNS: values.customDNSEndpoint,
      });
    },
    validationSchema: Yup.object().shape({
      customDNSEndpoint: Yup.string()
        //.url("Please enter a valid URL")
        .required("Target Alias is required"),
    }),
    enableReinitialize: true,
  });

  const removeCustomDNSFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: async (values) => {
      if (values.confirmationText === "deleteme") {
        try {
          await removeCustomDNSMutation?.mutateAsync();
          setShowDeleteConfirmationDialog(false);
          removeCustomDNSFormik.resetForm();
        } catch {}
      }
    },
  });

  async function handleAddDNS(payload: AddCustomDNSToResourceInstancePayload) {
    try {
      await addCustomDNSMutation?.mutateAsync(payload);
      setShouldShowConfigDialog(true);
      setIsTextFieldDisabled(true);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (customDNSData.enabled === true && customDNSData.dnsName) {
      setIsTextFieldDisabled(true);
    } else if (customDNSData.enabled === true && !customDNSData.dnsName) {
      setIsTextFieldDisabled(false);
      setIsToggleChecked(false);
    }
  }, [customDNSData]);

  useEffect(() => {
    if (isCustomDNSSetup && shouldShowConfigDialog) {
      setShowConfigurationDialog(true);
      setShouldShowConfigDialog(false);
    }
  }, [isCustomDNSSetup, shouldShowConfigDialog, setShouldShowConfigDialog]);

  const statusStylesAndLabel = getCustomDNSStatusStylesAndLabel(
    customDNSData?.status
  );

  return (
    <>
      <Card
        sx={{
          p: 0,
          borderRadius: "8px",
        }}
      >
        <Box
          display={"flex"}
          gap="16px"
          padding={"20px 24px"}
          alignItems="center"
          borderBottom={"1px solid rgba(213, 215, 218, 1)"}
        >
          <Box>
            <PublicIcon />
          </Box>
          <Text
            size="medium"
            weight="bold"
            color="#6941C6"
            sx={{ flex: 1, wordBreak: "break-word" }}
          >
            {resourceName}
          </Text>
        </Box>

        {resourceHasCompute && customDNSData?.enabled && (
          <>
            <Box
              padding={"24px"}
              borderBottom={"1px solid rgba(213, 215, 218, 1)"}
            >
              <FieldContainer marginTop={0} sx={{ maxWidth: "1000px" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="24px"
                  marginTop="6px"
                >
                  <TextField
                    //@ts-ignore
                    marginTop="0px"
                    name="customDNSEndpoint"
                    placeholder="Enter Target alias..."
                    onChange={customDNSFormik.handleChange}
                    onBlur={customDNSFormik.handleBlur}
                    value={customDNSFormik.values.customDNSEndpoint}
                    disabled={isTextfieldDisabled}
                    ref={textfieldRef}
                    copyButton={isTextfieldDisabled}
                  />
                  {isTextfieldDisabled ? (
                    <>
                      <IconButtonSquare
                        onClick={() => {
                          setShowConfigurationDialog(true);
                        }}
                      >
                        <ViewInstructionsIcon color="#7F56D9" />
                      </IconButtonSquare>
                      <IconButtonSquare
                        onClick={() => {
                          setIsTextFieldDisabled(false);
                          //textfieldRef.current.focus();
                          setIsEditing(true);
                        }}
                      >
                        <EditIcon color="#7F56D9" />
                      </IconButtonSquare>
                      <IconButtonSquare
                        sx={{ borderColor: "#FDA29B !important" }}
                        onClick={() => {
                          setDeleteMessage(
                            "Are you sure you want to delete this endpoint alias?"
                          );
                          setShowDeleteConfirmationDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButtonSquare>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "999px",
                        }}
                        onClick={() => {
                          customDNSFormik.submitForm();
                        }}
                      >
                        Verify{" "}
                        {addCustomDNSMutation?.isLoading && (
                          <LoadingSpinnerSmall />
                        )}
                      </Button>
                      {isEditing && (
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#D92D20 !important",
                          }}
                          onClick={() => {
                            customDNSFormik.resetForm();
                            setIsEditing(false);
                            setIsTextFieldDisabled(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
                <FieldError>
                  {customDNSFormik.touched.customDNSEndpoint &&
                    customDNSFormik.errors.customDNSEndpoint}
                </FieldError>
              </FieldContainer>
            </Box>
          </>
        )}

        {isCustomDNSSetup && (
          <TextConfirmationDialog
            open={showDeleteConfirmationDialog}
            handleClose={() => {
              setShowDeleteConfirmationDialog(false);
              removeCustomDNSFormik.resetForm();
            }}
            formData={removeCustomDNSFormik}
            title={`Delete Endpoint Alias`}
            subtitle={deleteMessage}
            message={
              "To confirm deletion, please enter <b>deleteme</b>, in the field below:"
            }
            isLoading={removeCustomDNSMutation?.isLoading}
            isDeleteEnable={true}
          />
        )}
        <CustomDNSDetailsModal
          open={showConfigurationDialog}
          aRecordTarget={customDNSData?.aRecordTarget}
          cnameTarget={customDNSData?.cnameTarget}
          domainName={customDNSData?.dnsName}
          handleClose={() => {
            setShowConfigurationDialog(false);
          }}
        />
      </Card>
    </>
  );
};

export default ResourceConnectivityCustomDNS;
