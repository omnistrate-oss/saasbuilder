import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";

import Button from "src/components/Button/Button";
import CopyToClipboardButton from "src/components/CopyClipboardButton/CopyClipboardButton";
import InstructionsModalIcon from "src/components/Icons/AccountConfig/InstructionsModalIcon";
import { Text } from "src/components/Typography/Typography";

const StyledContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  right: "50%",
  transform: "translateX(50%) translateY(-50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "460px",
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
  gap: "12px",
  marginTop: "12px",
});

const BodyText = ({ children, ...restProps }) => {
  return (
    <Text size="small" weight="medium" color="#344054" {...restProps}>
      {children}
    </Text>
  );
};

const InstanceIdContainer = (props) => {
  const { instanceId } = props;
  return (
    <Box
      sx={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: "6px 14px",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          background: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text data-testid="instance-id" size="medium" weight="medium" color="#667085" ellipsis>
          {instanceId}
        </Text>

        <CopyToClipboardButton text={instanceId} iconProps={{ color: "#98A2B3" }} />
      </Box>
    </Box>
  );
};

type CreateInstanceModalProps = {
  open: boolean;
  handleClose: () => void;
  data: any;
};

function CreateInstanceModal(props: CreateInstanceModalProps) {
  const { open, handleClose, data } = props;

  const instanceId = data?.instanceId;
  const isCustomDNS = data?.isCustomDNS;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <StyledContainer>
        <Header>
          <Stack direction="row" alignItems="center" gap="16px">
            <Box
              sx={{
                border: "1px solid #E4E7EC",
                boxShadow: "0px 1px 2px 0px #1018280D, 0px -2px 0px 0px #1018280D,0px 0px 0px 1px #1018282E",
                borderRadius: "10px",
                width: "48px",
                height: "48px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InstructionsModalIcon />
            </Box>
            <Text size="large" weight="semibold">
              Launching Your Instance
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon sx={{ color: "#98A2B3" }} />
          </IconButton>
        </Header>
        <Content>
          <BodyText>
            Your instance is being set up and will be ready shortly (usually within a few minutes). You can track its
            status in Deployment Instances. Below is the Instance ID for your reference
          </BodyText>
          <InstanceIdContainer instanceId={instanceId} />
          <List>
            {isCustomDNS && (
              <BodyText>
                As you have provided a custom DNS, it will need to be configured with your DNS provider. The
                configuration details will be available after some time. Please revisit the Custom DNS tab later to
                access the necessary information.
              </BodyText>
            )}
          </List>
        </Content>
        <Footer>
          <Button variant="contained" onClick={handleClose} data-testid="close-instructions-button" fullWidth>
            Close
          </Button>
        </Footer>
      </StyledContainer>
    </Dialog>
  );
}

export default CreateInstanceModal;
