import { SxProps, Theme, Stack, Box } from "@mui/material";
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
import { getCustomDNSStatusStylesAndLabel } from "src/constants/statusChipStyles/customDNS";
import { useMutation } from "@tanstack/react-query";
import Card from "src/components/Card/Card";
import PublicIcon from "src/components/Icons/DNSIcon/PublicIcon";
import { AddCustomDNSToResourceInstancePayload } from "./ConnectivityCustomDNS";
import CustomDNSDetails from "./CustomDNSDetails";

type EndpointProps = {
  resourceName: string;
  containerStyles?: SxProps<Theme>;
  resourceKey: string;
  resourceId: string;
  resourceHasCompute: boolean;
  customDNSData?: {
    enabled: boolean;
    dnsName?: string;
    status?: string;
    cnameTarget?: string;
    aRecordTarget?: string;
  };
  accessQueryParams?: {
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

const CustomDNS: FC<EndpointProps> = (props) => {
  const {
    resourceName,
    customDNSData = { enabled: false },
    accessQueryParams,
    resourceKey,
    resourceId,
    refetchInstance,
    resourceHasCompute,
  } = props;

  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isTextfieldDisabled, setIsTextFieldDisabled] = useState(false);
  const textfieldRef = useRef<HTMLInputElement>();
  const timeoutID = useRef(null);
  const pollCount = useRef(0);

  const { dnsName } = customDNSData;
  let isCustomDNSSetup = false;
  if (dnsName) {
    isCustomDNSSetup = true;
  }

  const addCustomDNSMutation = useMutation({
    mutationFn: (payload: AddCustomDNSToResourceInstancePayload) => {
      return addCustomDNSToResourceInstance(
        accessQueryParams.serviceProviderId,
        accessQueryParams.serviceKey,
        accessQueryParams.serviceAPIVersion,
        accessQueryParams.serviceEnvironmentKey,
        accessQueryParams.serviceModelKey,
        accessQueryParams.productTierKey,
        resourceKey,
        accessQueryParams.resourceInstanceId,
        accessQueryParams.subscriptionId,
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
        accessQueryParams.serviceProviderId,
        accessQueryParams.serviceKey,
        accessQueryParams.serviceAPIVersion,
        accessQueryParams.serviceEnvironmentKey,
        accessQueryParams.serviceModelKey,
        accessQueryParams.productTierKey,
        resourceKey,
        accessQueryParams.resourceInstanceId,
        accessQueryParams.subscriptionId
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
    clearExistingTimeout();
    pollCount.current = 0;
    verifyDNSRemoval();

    function verifyDNSRemoval() {
      if (pollCount.current < 5) {
        pollCount.current++;
        const id = setTimeout(() => {
          getResourceInstanceDetails(
            accessQueryParams.serviceProviderId,
            accessQueryParams.serviceKey,
            accessQueryParams.serviceAPIVersion,
            accessQueryParams.serviceEnvironmentKey,
            accessQueryParams.serviceModelKey,
            accessQueryParams.productTierKey,
            resourceKey,
            accessQueryParams.resourceInstanceId,
            accessQueryParams.subscriptionId
          )
            .then((response) => {
              const topologyDetails =
                response.data?.detailedNetworkTopology?.[resourceId];
              //check for dnsName field in the response, absence means dns removal complete
              if (!Boolean(topologyDetails?.customDNSEndpoint.dnsName)) {
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
      setIsTextFieldDisabled(true);
    } catch {}
  }

  useEffect(() => {
    if (customDNSData.enabled === true && customDNSData.dnsName) {
      setIsTextFieldDisabled(true);
    } else if (customDNSData.enabled === true && !customDNSData.dnsName) {
      setIsTextFieldDisabled(false);
    }
  }, [customDNSData]);

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
              {(customDNSData?.aRecordTarget || customDNSData?.cnameTarget) && (
                <CustomDNSDetails
                  aRecordTarget={customDNSData?.aRecordTarget}
                  cnameTarget={customDNSData?.cnameTarget}
                  domainName={customDNSData?.dnsName}
                />
              )}
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
                          setIsTextFieldDisabled(false);
                          //textfieldRef.current.focus();
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
      </Card>
    </>
  );
};

export default CustomDNS;
