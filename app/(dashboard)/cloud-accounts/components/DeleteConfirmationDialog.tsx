import { FC, useEffect, useRef } from "react";
// import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";
import { useFormik } from "formik";

import TextField from "src/components/FormElementsv2/TextField/TextField";
import OffboardConfirmationIcon from "src/components/Icons/OffboardConfirmatiion/OffboardConfirmation";
import { Step, StepLabel, Stepper } from "src/components/Stepper/Stepper";
import useSnackbar from "src/hooks/useSnackbar";
import { AccountConfig } from "src/types/account-config";
import Button from "components/Button/Button";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import DeleteCirleIcon from "components/Icons/DeleteCircle/DeleteCirleIcon";
import { Text } from "components/Typography/Typography";

import { cloudAccountOffboardingSteps } from "../constants";

import { OffboardingInstructions, OffboardInstructionDetails } from "./OffboardingInstructions";

const StyledForm = styled(Box)({
  top :"50%",
  position: "fixed",
  right: "50%",
  transform: "translate(50%, -50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "588px",
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
});

const Footer = styled(Box)({
  marginTop: "24px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "16px",
});

const LastInstanceConfimationMessage: FC<{
  step: number;
  offboardingInstructionDetails: OffboardInstructionDetails;
}> = ({ step, offboardingInstructionDetails }) => {
  if (step === 0) {
    return (
      <>
        <Text size="small" weight="medium" color="#414651">
          You are about to delete the last cloud account instance linked to this cloud account. This will begin the
          deletion process and mark the account for offboarding.
        </Text>
        <Box marginLeft="10px" marginTop="20px" borderLeft="2px solid #F79009" paddingLeft="10px">
          <Text size="small" weight="medium" color="#414651">
            <b>Note:</b> Deletion may take a few minutes and will run in the background.You can safely close this popup
            and return later to complete the off-boarding step.
            <br />
            <br />
            Once deletion is complete, the lifecycle status will update and you’ll be able to continue cleanup.
          </Text>
        </Box>
      </>
    );
  } else {
    return <OffboardingInstructions offboardingInstructionDetails={offboardingInstructionDetails} />;
  }
};

const ConfirmationMessage = () => {
  return (
    <>
      <Text size="small" weight="medium" color="#414651">
        You&apos;re about to delete this cloud account instance.
      </Text>

      <Text size="small" weight="regular" color="#414651" sx={{ mt: "12px" }}>
        Other cloud account instances using the same cloud account across different product subscriptions will continue
        to function normally.This action will only remove the selected instance.
      </Text>
    </>
  );
};

type DeleteAccountConfigConfirmationDialogProps = {
  accountConfig: AccountConfig | undefined;
  instanceStatus: string | undefined;
  isLoadingAccountConfig: boolean;
  open: boolean;
  onClose: () => void;
  isDeletingInstance: boolean;
  // isDeletingAccountConfig: boolean;
  onInstanceDeleteClick: () => Promise<void>;
  onOffboardClick: () => Promise<void>;
  offboardingInstructionDetails: OffboardInstructionDetails;
};

const DeleteAccountConfigConfirmationDialog: FC<DeleteAccountConfigConfirmationDialogProps> = (props) => {
  const {
    open = false,
    isDeletingInstance,
    // isDeletingAccountConfig,
    accountConfig,
    instanceStatus,
    offboardingInstructionDetails,
    onClose,
    onInstanceDeleteClick,
    onOffboardClick,
  } = props;

  const snackbar = useSnackbar();
  const firstDeleteRequestMade = useRef(false);
  const stepChangedToOffboard = useRef(false);
  const isLastInstance = !accountConfig?.byoaInstanceIDs || accountConfig?.byoaInstanceIDs?.length === 1;
  // const isLastInstance = true;

  const showStepper = isLastInstance;
  let step: "delete" | "offboard" = "delete";

  let buttonText = "Delete";
  let IconComponent = DeleteCirleIcon;
  let title = "Delete Confirmation";
  let isButtonDisabled = false;
  let isDeletionInProgress = false;

  if (isLastInstance) {
    IconComponent = OffboardConfirmationIcon;
    title = "Delete and Offboard Account";
  }

  if (showStepper) {
    //if instance status is DELETING and if the account config status is READY_TO_OFFBOARD, then we show the offboard step else we show the delete step
    if (instanceStatus === "DELETING" && accountConfig?.status === "READY_TO_OFFBOARD") {
      step = "offboard";
      buttonText = "Offboard";
    } else if (
      (instanceStatus === "DELETING" && accountConfig?.status !== "READY_TO_OFFBOARD") ||
      firstDeleteRequestMade.current === true
    ) {
      buttonText = "Deleting";
      isButtonDisabled = true;
      isDeletionInProgress = true;
    }
  }

  const activeStepIndex = step === "offboard" ? 1 : 0;

  const isLoading =
    isDeletingInstance ||
    // isDeletingAccountConfig ||
    (firstDeleteRequestMade.current === true && step === "delete");

  const formData = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: async (values) => {
      if (activeStepIndex === 0) {
        if (values.confirmationText === "deleteme") {
          try {
            await onInstanceDeleteClick();
            if (!isLastInstance) {
              handleClose();
            } else {
              firstDeleteRequestMade.current = true;
            }
          } catch {}
        } else {
          snackbar.showError(`Please enter deleteme to confirm`);
        }
      } else {
        if (values.confirmationText === "offboard") {
          await onOffboardClick();
          formData.resetForm();
          handleClose();
        } else {
          snackbar.showError(`Please enter offboard to confirm`);
        }
      }
    },
    validateOnChange: false,
  });

  function handleClose() {
    onClose();
    formData.resetForm();
  }

  useEffect(() => {
    if (open) {
      formData.resetForm();
      firstDeleteRequestMade.current = false;
      stepChangedToOffboard.current = false;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (step === "offboard" && !stepChangedToOffboard.current) {
      stepChangedToOffboard.current = true;
      formData.resetForm();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledForm
        maxWidth={isLastInstance ? "588px" : "543px"}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          formData.handleSubmit();
        }}
      >
        <Header>
          <Stack direction="row" alignItems="center" gap="16px">
            <IconComponent />
            <Text size="large" weight="bold">
              {title}
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Content>
          {showStepper && (
            <Stepper activeStep={activeStepIndex} alternativeLabel sx={{ marginBottom: "20px" }}>
              {cloudAccountOffboardingSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {isLastInstance ? (
            <LastInstanceConfimationMessage
              step={activeStepIndex}
              offboardingInstructionDetails={offboardingInstructionDetails}
            />
          ) : (
            <ConfirmationMessage />
          )}

          <Text size="small" weight="medium" color="#344054" sx={{ mt: "20px" }}>
            To confirm {activeStepIndex === 0 ? "deletion" : "offboarding"}, please enter{" "}
            <i>
              <b> {activeStepIndex === 0 ? "deleteme" : "offboard"}</b>
            </i>
            , in the field below:
          </Text>
          <TextField
            name="confirmationText"
            value={formData.values.confirmationText}
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            disabled={isDeletionInProgress}
            sx={{
              marginTop: "16px",
              [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
                borderColor: "rgba(254, 228, 226, 1) !important",
              },
            }}
          />
        </Content>

        <Footer>
          <Button
            variant="outlined"
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            disabled={isLoading}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            type="submit"
            variant="contained"
            disabled={isLoading || isButtonDisabled || isDeletionInProgress}
            bgColor={"#D92D20"}
          >
            {buttonText}
            {isLoading && <LoadingSpinnerSmall />}
          </Button>
        </Footer>
      </StyledForm>
    </Dialog>
  );
};

export default DeleteAccountConfigConfirmationDialog;
