import { FC } from "react";
// import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";
import { useFormik } from "formik";

import TextField from "src/components/FormElementsv2/TextField/TextField";
import ArrowBulletIcon from "src/components/Icons/ArrowIcon/ArrowBulletIcon";
import useSnackbar from "src/hooks/useSnackbar";
import { AccountConfig } from "src/types/account-config";
import Button from "components/Button/Button";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import DeleteCirleIcon from "components/Icons/DeleteCircle/DeleteCirleIcon";
import { Text } from "components/Typography/Typography";

const StyledForm = styled(Box)({
  position: "fixed",
  top: "0",
  right: "50%",
  transform: "translateX(50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "543px",
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

const List = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "8px",
});

const ListItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "4px",
});

const ListItemIcon = styled(Box)({
  flexShrink: 0,
});

const LastInstanceConfimationMessage = () => {
  return (
    <>
      <Text size="small" weight="medim" color="#414651">
        You are about to delete the last cloud account instance linked to this cloud account. This will mark the cloud
        account for deletion.
      </Text>
      <Text size="small" weight="semibold" color="#344054" sx={{ mt: "12px" }}>
        Note: Deletion is a two-step process:{" "}
      </Text>
      <List>
        <ListItem>
          <ListItemIcon>
            <ArrowBulletIcon />
          </ListItemIcon>

          <Text size="small" weight="regular" color="#414651">
            The instance and cloud account will be marked for deletion.
          </Text>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowBulletIcon />
          </ListItemIcon>

          <Text size="small" weight="regular" color="#414651">
            You will need to return later to complete offboarding.
          </Text>
        </ListItem>
      </List>
    </>
  );
};

const ConfirmationMessage = () => {
  return (
    <>
      <Text size="small" weight="medium" color="#414651">
        You&apos;re about to delete this cloud account instance.
      </Text>

      <Text size="small" weight="regular" color="#414651" sx={{ mt: "12px" }}>
        Other cloud account instances using the same cloud account across different Product Subscriptions will continue
        to function normally.This action will only remove the selected instance.
      </Text>
    </>
  );
};

type DeleteAccountConfigConfirmationDialogProps = {
  accountConfig: AccountConfig | undefined;
  isLoadingAccountConfig: boolean;
  open: boolean;
  onClose: () => void;
  buttonLabel?: string;
  buttonColor?: string;
  isLoading?: boolean;
  IconComponent?: React.ComponentType;
  onConfirm: () => Promise<void>;
};

const DeleteAccountConfigConfirmationDialog: FC<DeleteAccountConfigConfirmationDialogProps> = (props) => {
  const { open = false, onClose, isLoading, IconComponent = DeleteCirleIcon, accountConfig, onConfirm } = props;
  const snackbar = useSnackbar();

  const formData = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: async (values) => {
      if (values.confirmationText === "deleteme") {
        console.log("Confirm");
        await onConfirm();
        formData.resetForm();
        handleClose();
      } else {
        snackbar.showError(`Please enter deleteme to confirm`);
      }
    },
    validateOnChange: false,
  });

  function handleClose() {
    onClose();
    formData.resetForm();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledForm
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
              Delete Confirmation
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Content>
          {accountConfig?.byoaInstanceIDs && accountConfig?.byoaInstanceIDs?.length > 1 ? (
            <ConfirmationMessage />
          ) : (
            <LastInstanceConfimationMessage />
          )}

          <Text size="small" weight="medium" color="#344054" sx={{ mt: "20px" }}>
            To confirm deletion, please enter{" "}
            <i>
              <b> deleteme</b>
            </i>
            , in the field below:
          </Text>
          <TextField
            name="confirmationText"
            value={formData.values.confirmationText}
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
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
            disabled={isLoading}
            bgColor={"#D92D20"}
          >
            Delete{isLoading && <LoadingSpinnerSmall />}
          </Button>
        </Footer>
      </StyledForm>
    </Dialog>
  );
};

export default DeleteAccountConfigConfirmationDialog;
