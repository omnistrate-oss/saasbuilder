import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";

import AlertTriangle from "src/components/Icons/AlertTriangle/AlertTriangle";
import SubmitButton from "src/components/NonDashboardComponents/FormElementsV2/SubmitButton";
import { Text } from "src/components/Typography/Typography";

const StyledContainer = styled(Box)({
  position: "fixed",
  top: 0,
  right: "50%",
  transform: "translateX(50%) translateY(0%)",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "450px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

const AccessDeniedAlertDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledContainer>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap="16px">
            <Box sx={{ padding: "12px", border: "1px solid #F79009", borderRadius: "10px" }}>
              <AlertTriangle width={24} height={24} />
            </Box>
            <Text size="large" color="#101828">
              Access denied
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box mt="20px">
          <Text size="small" weight="regular" color="#414651">
            It looks like you are trying to sign in with Omnistrate credentials. <br /> <br />
            To access Production environment, please Sign-up as a customer or use your existing customer credentials.
          </Text>
        </Box>

        <Stack direction="row" justifyContent="center" mt="32px">
          <SubmitButton
            onClick={handleClose}
            loading={false}
            sx={{
              padding: "10px 28px !important",
              fontWeight: 600,
            }}
          >
            Close
          </SubmitButton>
        </Stack>
      </StyledContainer>
    </Dialog>
  );
};

export default AccessDeniedAlertDialog;
