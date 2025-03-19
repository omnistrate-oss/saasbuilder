import Button from "components/Button/Button";
import TextField from "components/FormElements/TextField/TextField";
import {
  Stack,
  styled,
  Box,
  Dialog,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import { Text } from "components/Typography/Typography";
import Link from "next/link";

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
import ConnectIcon from "../Icons/Connect/Connect";
import {
  CustomStepIcon,
  getStepperProps,
  stateAccountConfigStepper,
  stepsConnectRunAccountConfig,
} from "../Stepper/utils";
import useSnackbar from "src/hooks/useSnackbar";

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

const usePolling = (
  instance,
  fetchClickedInstanceDetails,
  setClickedInstance
) => {
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(true);
  const timeoutId = useRef(null);
  const pollCountRef = useRef(0);
  const pollInterval = 10000; // 10 seconds
  const isMounted = useRef(true);

  useEffect(() => {
    const startPolling = async () => {
      if (!isMounted.current) return;

      let resourceInstance;
      try {
        const resourceInstanceResponse = await fetchClickedInstanceDetails();
        resourceInstance = resourceInstanceResponse.data;
      } catch {
        console.log("check error in polling ");
      }

      if (!isMounted.current) return;

      if (resourceInstance?.status !== instance?.status) {
        setClickedInstance((prev) => ({
          ...prev,
          status: resourceInstance.status,
          result_params: {
            ...prev?.result_params,
            ...resourceInstance.result_params,
          },
        }));

        queryClient.setQueryData(["instances"], (oldData) => ({
          ...oldData,
          data: {
            resourceInstances: (oldData?.data?.resourceInstances || []).map(
              (inst) =>
                inst?.id === resourceInstance?.id
                  ? {
                      ...resourceInstance,
                      status: resourceInstance.status,
                      result_params: resourceInstance.result_params,
                    }
                  : inst
            ),
          },
        }));

        setIsPolling(false);
      } else if (pollCountRef.current < 5) {
        pollCountRef.current += 1;
        timeoutId.current = setTimeout(startPolling, pollInterval);
      } else {
        setIsPolling(false);
      }
    };

    // Delay the first execution by pollInterval (10 seconds)
    timeoutId.current = setTimeout(startPolling, pollInterval);

    return () => {
      isMounted.current = false;
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [instance, fetchClickedInstanceDetails, setClickedInstance, queryClient]);

  return { isPolling };
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
          <ConnectIcon />
        </Box>
        <Text size="large" weight="semibold" color="#101828">
          {"Connect Cloud Account"}
        </Text>
      </Stack>
      <List>
        <ListItem>
          <Text size="small" weight="regular" color="#414651">
            {`Connecting your cloud account will allow ${serviceOrgName} to manage and
            automate all associated instances.`}
          </Text>
        </ListItem>
      </List>
      <Box>
        <Text
          size="small"
          weight="semibold"
          color="#344054"
          dangerouslySetInnerHTML={{
            __html: "To confirm, please enter connect in the field below:",
          }}
        />
        <TextField
          id="connect"
          name="connect"
          value={formData.values.connect}
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
    let timer = null;

    // Timer logic for activeStepRun === 0
    if (activeStepRun === 0) {
      timer = setTimeout(() => {
        setActiveStepRun(1);
      }, 1000);
    }

    // Handle instance status updates
    if (instance?.status === "CONNECTING") {
      setActiveStepRun(1);
    }

    // Cleanup the timer to avoid memory leaks
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [activeStepRun, setActiveStepRun, instance?.status]);

  usePolling(instance, fetchClickedInstanceDetails, setClickedInstance);

  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap="10px">
      <Stepper activeStep={activeStepRun} orientation="vertical">
        {stepsConnectRunAccountConfig.map((step, index) => {
          return (
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
          );
        })}
      </Stepper>
      {activeStepRun === 1 && (
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
              href={`${instance?.result_params?.connect_cloudformation_url}`}
            >
              this
            </StyledLink>
             CloudFormation template to grant {`${serviceOrgName}`} the required
            permissions.
          </Text>
          <Chip
            label={
              <Stack direction="row" alignItems="center" gap="6px">
                <AlertTriangle />
                <Text size="xsmall" weight="medium" color="#B54708">
                  This is a mandatory step to fully establish the cloud account
                  connection.
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
  usePolling(instance, fetchClickedInstanceDetails, setClickedInstance);

  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap="10px">
      {status === "READY" ? (
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
                change to Connected.
              </Text>
            </ListItem>
            <ListItem>
              <Text size="small" weight="semibold" color="#414651">
                If you need to update the CloudFormation stack configuration{" "}
                <StyledLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${instance?.result_params?.connect_cloudformation_url}`}
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

function ConnectAccountConfigDialog(props) {
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
  const snackbar = useSnackbar();
  const [connectState, setConnectState] = useState(
    stateAccountConfigStepper.trigger
  );
  const [activeStepRun, setActiveStepRun] = useState(0);

  useEffect(() => {
    if (instance?.status === "CONNECTING" && activeStepRun < 1) {
      setConnectState(stateAccountConfigStepper.run);
    } else if (
      instance?.status === "READY" ||
      instance?.status === "ATTACHING"
    ) {
      setConnectState(stateAccountConfigStepper.check);
    } else if (instance?.status === "DISCONNECTED") {
      setConnectState(stateAccountConfigStepper.trigger);
      setActiveStepRun(0);
    }
  }, [connectState, setConnectState, instance?.status]);

  const accountConfigMutation = useMutation(
    () => {
      const requestPayload = {
        subscriptionId: instance?.subscriptionId,
        instanceId: instance?.id,
        disconnect: true,
        serviceId: serviceId,
      };
      return disconnected(requestPayload);
    },
    {
      onSuccess: () => {
        refetchInstances();
        snackbar.showSuccess("Connect account config...");
        connectStatechange(stateAccountConfigStepper.run);
        // eslint-disable-next-line no-use-before-define
        formik.resetForm();
      },
    }
  );
  const formik = useFormik({
    initialValues: {
      connect: "",
    },
    onSubmit: (values) => {
      if (!instance) return snackbar.showError("No instance selected");

      if (values.connect === "connect") {
        accountConfigMutation.mutate();
      } else {
        snackbar.showError("Please enter connect");
      }
    },
    validateOnChange: false,
  });

  const connectStatechange = (step) => {
    setConnectState(step);
  };

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
    setConnectState(stateAccountConfigStepper.trigger);
    setActiveStepRun(0);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledForm>
        <Header>
          <StepStepper
            {...getStepperProps(connectState, roundNumberToTwoDecimals(100))}
          />
        </Header>
        <Content>
          {connectState === stateAccountConfigStepper.trigger && (
            <Trigger formData={formik} serviceOrgName={serviceOrgName} />
          )}
          {connectState === stateAccountConfigStepper.run && (
            <Run
              activeStepRun={activeStepRun}
              setActiveStepRun={setActiveStepRun}
              instance={instance}
              fetchClickedInstanceDetails={fetchClickedInstanceDetails}
              setClickedInstance={setClickedInstance}
              serviceOrgName={serviceOrgName}
            />
          )}

          {connectState === stateAccountConfigStepper.check && (
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
          {connectState === stateAccountConfigStepper.trigger && (
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
              {"Connect"}{" "}
              {isFetching ||
                (accountConfigMutation.isLoading && <LoadingSpinnerSmall />)}
            </Button>
          )}
          {connectState === stateAccountConfigStepper.run && (
            <Button
              type="submit"
              variant="contained"
              sx={{
                height: "40px !important",
                padding: "10px 14px !important",
              }}
              disabled={activeStepRun !== 1 || instance?.status === "ATTACHING"}
              bgColor={buttonColor}
              onClick={() => {
                connectStatechange(stateAccountConfigStepper.check);
              }}
            >
              {"Verify"} {isFetching && <LoadingSpinnerSmall />}
            </Button>
          )}
          {connectState === stateAccountConfigStepper.check && (
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

export default ConnectAccountConfigDialog;
