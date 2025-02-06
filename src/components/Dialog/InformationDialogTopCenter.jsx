import { Box, Dialog, styled } from "@mui/material";

function InformationDialogTopCenter({
  open,
  handleClose,
  children,
  maxWidth = "550px",
}) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"tablet"}>
      <StyledContainer maxWidth={maxWidth}>{children}</StyledContainer>
    </Dialog>
  );
}

export default InformationDialogTopCenter;

const StyledContainer = styled(Box)(({ maxWidth }) => ({
  position: "fixed",
  top: "50%",
  right: "50%",
  transform: "translateX(50%) translateY(-50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow:
    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: maxWidth,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
}));

export const DialogHeader = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const DialogContent = styled(Box)({
  marginTop: "20px",
  width: "100%",
});

export const DialogFooter = styled(Box)({
  marginTop: "24px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "16px",
});
