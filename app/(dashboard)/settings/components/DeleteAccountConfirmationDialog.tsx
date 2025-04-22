"use client";

import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import Button from "components/Button/Button";
import Form from "components/FormElements/Form/Form";
import { Text } from "src/components/Typography/Typography";
import DeleteOutlinedIcon from "src/components/Icons/DeleteOutlined/DeleteOutlined";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import ArrowBulletIcon from "src/components/Icons/ArrowIcon/ArrowBulletIcon";
import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";
import CustomCheckbox from "src/components/Checkbox/Checkbox";
import { useState } from "react";

const Dialog = styled(MuiDialog)(() => ({
  [`& .MuiPaper-root `]: {
    width: "100%",
    maxWidth: "490px",
    padding: "24px",
  },
}));

const DialogTitle = styled(MuiDialogTitle)(() => ({
  padding: 0,
}));

const DialogContent = styled(MuiDialogContent)(() => ({
  padding: 0,
}));

const DialogActions = styled(MuiDialogActions)(() => ({
  padding: 0,
  paddingTop: 30,
}));

const List = styled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
  marginLeft: "6px",
  marginTop: "8px",
});

const ListItem = styled("li")({
  marginBottom: "8px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#535862",
  display: "flex",
  alignItems: "start",
  fontWeight: 400,
  gap: "10px",
});

const DeleteAccountConfirmationDialog = (props) => {
  const {
    open = false,
    handleClose,
    buttonLabel = "Delete",
    isLoading,
    IconComponent = DeleteOutlinedIcon,
    handleSubmit,
  } = props;
  const { orgName } = useProviderOrgDetails();
  const [checked, setChecked] = useState(false);

  function onClose() {
    handleClose();
    setChecked(false);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      {/*@ts-ignore */}
      <Form onSubmit={handleSubmit}>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap="16px">
              <IconComponent />
              <Text size="large" weight="bold">
                You're about to delete your account{" "}
              </Text>
            </Stack>
            <IconButton onClick={onClose} sx={{ alignSelf: "flex-start" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Text size="medium" weight="semibold" sx={{ marginTop: "20px" }}>
            Deleting your account will permanently remove:{" "}
          </Text>
          <List>
            <ListItem>
              <ArrowBulletIcon />
              Your profile information (name, email, login credentials)
            </ListItem>
            <ListItem>
              <ArrowBulletIcon />
              Access tokens, and CLI configurations{" "}
            </ListItem>
            <ListItem>
              <ArrowBulletIcon />
              Activity logs associated with your account
            </ListItem>
          </List>
          <Text
            size="medium"
            weight="regular"
            color="#374151"
            sx={{ marginTop: "20px" }}
          >
            You will also lose access to all {orgName} subscriptions. This
            action is permanent and cannot be undone.
          </Text>
          <Stack marginTop="20px" direction="row" alignItems="start">
            <CustomCheckbox
              // @ts-ignore
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
              sx={{ padding: "0px", marginRight: "8px" }}
            />
            <Text size="small" weight="medium" color="#414651">
              I understand that deleting my account is permanent and
              irreversible.
            </Text>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="submit"
            variant="contained"
            disabled={isLoading || !checked}
            bgColor="#D92D20"
            fontColor="#FFFFFF"
          >
            {buttonLabel} {isLoading && <LoadingSpinnerSmall />}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default DeleteAccountConfirmationDialog;
