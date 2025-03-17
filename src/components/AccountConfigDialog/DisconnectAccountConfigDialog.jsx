import Button from "components/Button/Button";
import TextField from "components/FormElements/TextField/TextField";
import {
  Stack,
  styled,
  Box,
  Dialog,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import { Text } from "components/Typography/Typography";
import Link from "next/link";
import DisconnectIcon from "../Icons/Disconnect/Disconnect";
import { roundNumberToTwoDecimals } from "src/utils/formatNumber";
import StepStepper from "../Stepper/StepStepper";
import { useEffect, useRef, useState } from "react";
import sandClock from "public/assets/images/cloud-account/sandclock.gif";
import Image from "next/image";
import Chip from "../Chip/Chip";
import AlertTriangle from "../Icons/AlertTriangle/AlertTriangle";
import StepperSuccessIcon from "../Stepper/StepperSuccessIcon";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnected } from "src/api/resourceInstance";
import {
  CustomStepIcon,
  getStepperProps,
  stateAccountConfigStepper,
  stepsDisconnectRunAccountConfig,
} from "../Stepper/utils";

const StyledForm = styled(Box)({
  position: "fixed",
  top: "0",
  right: "50%",
  transform: "translateX(50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow:
    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "550px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

const Header = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Content = styled(Box)({
  marginTop: "20px",
  width: "100%",
  minHeight: "200px",
  display: "flex",
  justifyContent: "center", // Centers horizontally
  alignItems: "center", // Centers vertically
  flexDirection: "column", // Ensures children stack properly
});

const Footer = styled(Box)({
  marginTop: "24px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "16px",
});

const StyledLink = styled(Link)({
  textDecoration: "underline",
  color: "#7F56D9",
  fontWeight: 700,
  // fontStyle: "italic",
});

const List = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "8px",
});

const ListItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "4px",
});

const polling = (instance, fetchClickedInstanceDetails) => {
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(true);
  const timeoutId = useRef();
  // poll for three times with an interval of 2 seconds
  const pollCountRef = useRef(0);
  const pollInterval = 2000;
  const isMounted = useRef(true);

  const startPolling = async () => {
    if (!isMounted.current) return;

    let resourceInstance;

    try {
      const resourceInstanceResponse = await fetchClickedInstanceDetails();
      resourceInstance = resourceInstanceResponse.data;
    } catch {}

    if (!isMounted.current) return;

    const result_params = resourceInstance?.result_params;
    if (resourceInstance?.status !== instance.status) {
      setClickedInstance((prev) => ({
        ...prev,
        result_params: { ...prev?.result_params, ...result_params },
      }));

      queryClient.setQueryData(["instances"], (oldData) => {
        const result_params = {
          // @ts-ignore
          ...oldData?.data?.resourceInstances?.result_params,
          ...resourceInstance.result_params,
        };

        return {
          ...oldData,
          data: {
            resourceInstances: [
              ...(oldData?.data?.resourceInstances || [])?.map((instance) =>
                instance?.id === resourceInstance?.id
                  ? {
                      ...(resourceInstance || {}),
                      result_params: result_params,
                    }
                  : instance
              ),
            ],
          },
        };
      });

      setIsPolling(false);
    } else if (pollCountRef.current < 3) {
      pollCountRef.current += 1;
      timeoutId.current = setTimeout(() => {
        startPolling();
      }, pollInterval);
    } else {
      setIsPolling(false);
    }
  };
  startPolling();
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);
};

const Trigger = ({ formData, serviceOrgName }) => {
  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap="10px">
      <Stack direction="row" alignItems="center" gap="16px">
        <Box
          sx={{
            border: "1px solid #E4E7EC",
            boxShadow: "0px 1px 2px 0px #1018280D",
            boxshadow: "0px -2px 0px 0px #1018280D inset",
            boxShadow: "0px 0px 0px 1px #1018282E inset",
            padding: "12px",
            borderRadius: "10px",
            bgcolor: "#FFFFFF",
          }}
        >
          <DisconnectIcon />
        </Box>
        <Text size="large" weight="semibold" color="#101828">
          {"Disconnect Cloud Account"}
        </Text>
      </Stack>
      <List>
        <ListItem>
          <Text size="small" weight="regular" color="#414651">
            {`Disconnecting your cloud account will disconnect all associated
            instances from the ${serviceOrgName} Control Plane`}
          </Text>
        </ListItem>
      </List>
      <Box>
        <Text
          size="small"
          weight="semibold"
          color="#344054"
          dangerouslySetInnerHTML={{
            __html: "To confirm, please enter disconnect in the field below:",
          }}
        />
        <TextField
          id="disconnect"
          name="disconnect"
          value={formData.values.disconnect}
          onChange={formData.handleChange}
          onBlur={formData.handleBlur}
          sx={{
            marginTop: "16px",
            [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
              borderColor: "rgba(254, 228, 226, 1) !important",
            },
          }}
        />
      </Box>
    </Box>
  );
};

const Run = ({
  activeStepRun,
  setActiveStepRun,
  instance,
  fetchClickedInstanceDetails,
  setClickedInstance,
  serviceOrgName,
}) => {
  useEffect(() => {
    if (activeStepRun === 0 && instance.status === "detachning") {
      const timer = setTimeout(() => {
        setActiveStepRun(1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (instance.status === "disconnecting") {
      setActiveStepRun(2);
    }
  }, [activeStepRun, setActiveStepRun, instance]);
  polling(instance, fetchClickedInstanceDetails, setClickedInstance);
  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap="10px">
      <Stepper activeStep={activeStepRun} orientation="vertical">
        {stepsDisconnectRunAccountConfig.map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                "& .MuiStepLabel-label": {
                  cursor: "default !important",
                },
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStepRun === 2 && (
        <Box
          sx={{
            padding: "12px",
            background: "white",
            border: "1px solid #D9E0E8",
            boxShadow: "0px 1px 2px 0px #0A0D120D",
            borderRadius: "12px",
          }}
        >
          <Text size="small" weight="semibold" color="#414651">
            Run{" "}
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              href={`${instance.result_params?.disconnect_cloudformation_url}`}
            >
              this
            </StyledLink>
             CloudFormation template to revoke all {`${serviceOrgName}`}
            permissions from your account.
          </Text>
          <Chip
            label={
              <Stack direction="row" alignItems="center" gap="6px">
                <AlertTriangle />
                <Text size="xsmall" weight="medium" color="#B54708">
                  This is a mandatory step to fully disconnect your cloud
                  account.
                </Text>
              </Stack>
            }
            fontColor="#B54708"
            bgColor="#FFFAEB"
            sx={{
              marginTop: "6px",
              display: "inline-block",
              padding: "2px 8px",
              border: "1px solid #FEDF89",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

const Check = ({
  status,
  instance,
  fetchClickedInstanceDetails,
  setClickedInstance,
}) => {
  polling(instance, fetchClickedInstanceDetails, setClickedInstance);
  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap="10px">
      {status === "disconnected" ? (
        <Box
          sx={{
            padding: "12px",
            background: "white",
            border: "1px solid #E9EAEB",
            boxShadow: "0px 1px 2px 0px #0A0D120D",
            borderRadius: "12px",
          }}
        >
          {" "}
          <Stack
            direction="row"
            justifyContent={"center"}
            alignItems="center"
            gap="16px"
          >
            <StepperSuccessIcon />
            <Text size="large" weight="semibold" color="#101828">
              {"Verification complete"}
            </Text>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            padding: "12px",
            background: "white",
            border: "1px solid #E9EAEB",
            boxShadow: "0px 1px 2px 0px #0A0D120D",
            borderRadius: "12px",
          }}
        >
          {" "}
          <Stack
            direction="row"
            justifyContent={"center"}
            alignItems="center"
            gap="16px"
          >
            <Image src={sandClock} alt="sandwatch" width={26} />
            <Text size="large" weight="semibold" color="#101828">
              {"Verification is in progress..."}
            </Text>
          </Stack>
          <List>
            <ListItem>
              <Text size="small" weight="semibold" color="#414651">
                The verification process is running in the background, you can
                close this popup by clicking Close.
              </Text>
            </ListItem>
            <ListItem>
              <Text size="small" weight="semibold" color="#414651">
                Once the verification is complete, the lifecycle status will
                change to Disconnected.
              </Text>
            </ListItem>
            <ListItem>
              <Text size="small" weight="semibold" color="#414651">
                If you need to update the CloudFormation stack configuration
                <StyledLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${instance.result_params?.disconnect_cloudformation_url}`}
                >
                  click here.
                </StyledLink>
              </Text>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );
};

function DisconnectAccountConfigDialog(props) {
  const {
    open = false,
    handleClose,
    buttonColor = "#079455",
    isFetching,
    instance,
    refetchInstances,
    fetchClickedInstanceDetails,
    setClickedInstance,
    serviceId,
    serviceOrgName,
  } = props;
  const [disconnectState, setDisconnectState] = useState(
    stateAccountConfigStepper.trigger
  );
  const [activeStepRun, setActiveStepRun] = useState(0);

  useEffect(() => {
    if (instance?.status === "disconnecting" && activeStepRun === 0) {
      setDisconnectState(stateAccountConfigStepper.check);
    }
  }, [disconnectState, setDisconnectState, instance]);

  const accountConfigMutation = useMutation(
    () => {
      const requestPayload = {
        subscriptionId: instance?.subscriptionId,
        instanceId: instance?.id,
        disconnect: false,
        serviceId: serviceId,
      };
      return disconnected(requestPayload);
    },
    {
      onSuccess: () => {
        refetchInstances();
        snackbar.showSuccess("Disconnect account config...");
        connectStatechange(stateAccountConfigStepper.run);
        // eslint-disable-next-line no-use-before-define
        formik.resetForm();
      },
    }
  );
  const formik = useFormik({
    initialValues: {
      disconnect: "",
    },
    onSubmit: (values) => {
      if (!instance) return snackbar.showError("No instance selected");

      if (values.disconnect === "disconnect") {
        accountConfigMutation.mutate();
      } else {
        snackbar.showError("Please enter disconnect");
      }
    },
    validateOnChange: false,
  });

  const connectStatechange = (step) => {
    setDisconnectState(step);
  };

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledForm>
        <Header>
          <StepStepper
            {...getStepperProps(disconnectState, roundNumberToTwoDecimals(100))}
          />
        </Header>
        <Content>
          {disconnectState === stateAccountConfigStepper.trigger && (
            <Trigger formData={formik} serviceOrgName={serviceOrgName} />
          )}
          {disconnectState === stateAccountConfigStepper.run && (
            <Run
              activeStepRun={activeStepRun}
              setActiveStepRun={setActiveStepRun}
              instance={instance}
              fetchClickedInstanceDetails={fetchClickedInstanceDetails}
              setClickedInstance={setClickedInstance}
              serviceOrgName={serviceOrgName}
            />
          )}

          {disconnectState === stateAccountConfigStepper.check && (
            <Check
              status={instance?.status}
              instance={instance}
              fetchClickedInstanceDetails={fetchClickedInstanceDetails}
              setClickedInstance={setClickedInstance}
            />
          )}
        </Content>

        <Footer>
          <Button
            variant="outlined"
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            disabled={isFetching}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          {disconnectState === stateAccountConfigStepper.trigger && (
            <Button
              type="submit"
              variant="contained"
              sx={{
                height: "40px !important",
                padding: "10px 14px !important",
              }}
              disabled={isFetching || accountConfigMutation.isLoading}
              bgColor={buttonColor}
              onClick={formik.handleSubmit}
            >
              {"Disconnect"}{" "}
              {isFetching ||
                (accountConfigMutation.isLoading && <LoadingSpinnerSmall />)}
            </Button>
          )}
          {disconnectState === stateAccountConfigStepper.run && (
            <Button
              type="submit"
              variant="contained"
              sx={{
                height: "40px !important",
                padding: "10px 14px !important",
              }}
              disabled={activeStepRun !== 2}
              bgColor={buttonColor}
              onClick={() => {
                connectStatechange(stateAccountConfigStepper.check);
              }}
            >
              {"Verify"} {isFetching && <LoadingSpinnerSmall />}
            </Button>
          )}
          {disconnectState === stateAccountConfigStepper.check && (
            <Button
              type="submit"
              variant="contained"
              sx={{
                height: "40px !important",
                padding: "10px 14px !important",
              }}
              disabled={isFetching}
              bgColor={buttonColor}
              onClick={handleCancel}
            >
              {"Close"} {isFetching && <LoadingSpinnerSmall />}
            </Button>
          )}
        </Footer>
      </StyledForm>
    </Dialog>
  );
}

export default DisconnectAccountConfigDialog;
