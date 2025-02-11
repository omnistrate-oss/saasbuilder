import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";
import Button from "src/components/Button/Button";
import { Text } from "src/components/Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import InstructionsModalIcon from "../Icons/AccountConfig/InstructionsModalIcon";
import CopyToClipboardButton from "../CopyClipboardButton/CopyClipboardButton";
import { ACCOUNT_CREATION_METHODS } from "src/utils/constants/accountConfig";

const STATUS_TITLE_MAP = {
  VERIFYING: "Account Configuration Instructions",
  PENDING: "Account Configuration Instructions",
  READY: "Account Configuration Ready",
  FAILED: "Account Config Verification Failed",
};

const STATUS_DESCRIPTION_MAP = {
  VERIFYING: "To complete the account configuration setup -",
  PENDING: "To complete the account configuration setup -",
  READY:
    "This account has already been configured successfully. However if you need to reconfigure for any reason, the instructions are provided below -",
  FAILED:
    "The account configuration verification failed. Please review the instructions below to retry the setup and resolve any issues -",
};

const StyledContainer = styled(Box)({
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
  maxWidth: "530px",
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

const StyledLink = styled(Link)({
  textDecoration: "underline",
  color: "#7F56D9",
  fontWeight: 600,
});

const List = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "12px",
});

const ListItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "12px",
});

const BodyText = ({ children, ...restProps }) => {
  return (
    <Text size="small" weight="regular" color="#344054" {...restProps}>
      {children}
    </Text>
  );
};
export const TextContainerToCopy = (props) => {
  const { text, marginTop = "20px" } = props;
  return (
    <Box
      sx={{
        marginTop: marginTop,
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
        <Text
          size="medium"
          weight="regular"
          color="#667085"
          ellipsis
          title={text}
        >
          {text}
        </Text>

        <CopyToClipboardButton text={text} iconProps={{ color: "#98A2B3" }} />
      </Box>
    </Box>
  );
};

const CreationTimeInstructions = (props) => {
  const {
    accountConfigMethod,
    accountConfigStatus,
    cloudformationlink,
    cloudFormationGuide,
    cloudFormationTemplateUrl,
    gcpBootstrapShellCommand,
    gcpCloudShellLink,
    shellScriptGuide,
    accountInstructionDetails,
  } = props;

  if (accountConfigStatus === "FAILED") {
    return (
      <BodyText>
        The account configuration could not be saved because of system error.
        Please try again. If the issue continues, reach out to support for
        assistance.{" "}
      </BodyText>
    );
  }

  if (accountConfigMethod === ACCOUNT_CREATION_METHODS.CLOUDFORMATION) {
    if (!cloudFormationTemplateUrl) {
      return (
        <BodyText>
          Your CloudFormation Stack is being configured. Please check back
          shortly for detailed setup instructions.
        </BodyText>
      );
    }

    return (
      <>
        <BodyText weight="medium">AWS Account ID</BodyText>
        <TextContainerToCopy
          text={accountInstructionDetails?.awsAccountID}
          marginTop="6px"
        />

        <BodyText sx={{ marginTop: "20px" }}>
          Your account details have been saved. To complete the setup please
          create your CloudFormation Stack using the provided template{" "}
          {cloudformationlink}.
        </BodyText>

        <BodyText sx={{ marginTop: "20px" }}>
          If an existing AWSLoadBalancerControllerIAMPolicy policy causes an
          error while creating the CloudFormation stack, set the parameter
          CreateLoadBalancerPolicy to &quot;false&quot;.
        </BodyText>

        <BodyText sx={{ marginTop: "20px" }}>
          For guidance, our instructional video is available{" "}
          {cloudFormationGuide}.
        </BodyText>
      </>
    );
  } else if (accountConfigMethod === ACCOUNT_CREATION_METHODS.GCP_SCRIPT) {
    if (!gcpBootstrapShellCommand) {
      return (
        <BodyText>
          Your GCP shell script is being configured. Please check back shortly
          for detailed setup instructions.
        </BodyText>
      );
    }

    return (
      <>
        <Stack direction={"row"} alignItems={"flex-start"} gap="12px">
          <Box flex={1} maxWidth={"50%"}>
            <BodyText weight="medium">GCP Project ID</BodyText>
            <TextContainerToCopy
              text={accountInstructionDetails?.gcpProjectID}
              marginTop="6px"
            />
          </Box>
          <Box flex={1} maxWidth={"50%"}>
            <BodyText weight="medium">GCP Project Number</BodyText>
            <TextContainerToCopy
              text={accountInstructionDetails?.gcpProjectNumber}
              marginTop="6px"
            />
          </Box>
        </Stack>

        <BodyText sx={{ marginTop: "20px" }}>
          Please open the Google Cloud Shell environment using the following
          link {gcpCloudShellLink} . Once the terminal is open, execute the
          following command:
        </BodyText>
        <TextContainerToCopy text={gcpBootstrapShellCommand} />

        <BodyText sx={{ marginTop: "20px" }}>
          For guidance, our instructional video is available {shellScriptGuide}.
        </BodyText>
      </>
    );
  } else {
    return (
      <BodyText>
        Your account details are being configured. Please check back shortly for
        detailed setup instructions.
      </BodyText>
    );
  }
};

const NonCreationTimeInstructions = (props) => {
  const {
    selectedAccountConfig,
    cloudformationlink,
    cloudFormationGuide,
    cloudFormationTemplateUrl,
    gcpBootstrapShellCommand,
    gcpCloudShellLink,
    shellScriptGuide,
    accountInstructionDetails,
  } = props;

  if (
    !accountInstructionDetails?.awsAccountID &&
    !accountInstructionDetails?.gcpProjectID
  ) {
    return (
      <BodyText>
        Your account details are being configured. Please check back shortly for
        detailed setup instructions.
      </BodyText>
    );
  }

  return (
    <>
      <Box width={"100%"}>
        {accountInstructionDetails?.awsAccountID && (
          <>
            <BodyText weight="medium">AWS Account ID</BodyText>
            <TextContainerToCopy
              text={accountInstructionDetails?.awsAccountID}
              marginTop="6px"
            />
          </>
        )}

        {accountInstructionDetails?.gcpProjectID && (
          <Stack direction={"row"} alignItems={"flex-start"} gap="12px">
            <Box flex={1} maxWidth={"50%"}>
              <BodyText weight="medium">GCP Project ID</BodyText>
              <TextContainerToCopy
                text={accountInstructionDetails?.gcpProjectID}
                marginTop="6px"
              />
            </Box>
            <Box flex={1} maxWidth={"50%"}>
              <BodyText weight="medium">GCP Project Number</BodyText>
              <TextContainerToCopy
                text={accountInstructionDetails?.gcpProjectNumber}
                marginTop="6px"
              />
            </Box>
          </Stack>
        )}

        <BodyText sx={{ marginTop: "20px", fontWeight: 600 }}>
          {STATUS_DESCRIPTION_MAP[selectedAccountConfig?.status] ??
            "To complete the account configuration setup -"}{" "}
        </BodyText>

        <List>
          {accountInstructionDetails?.awsAccountID && (
            <ListItem>
              {cloudFormationTemplateUrl ? (
                <>
                  <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
                    <BodyText>
                      Please create your CloudFormation Stack using the provided
                      template {cloudformationlink}.
                    </BodyText>
                    <BodyText>
                      If an existing AWSLoadBalancerControllerIAMPolicy policy
                      causes an error while creating the CloudFormation stack,
                      set the parameter CreateLoadBalancerPolicy to
                      &quot;false&quot;.
                    </BodyText>
                    <BodyText>
                      For guidance, our instructional video is available{" "}
                      {cloudFormationGuide}.
                    </BodyText>
                  </Box>
                </>
              ) : (
                <BodyText sx={{ marginTop: "20px" }}>
                  Your CloudFormation Stack is being configured. Please check
                  back shortly for detailed setup instructions.
                </BodyText>
              )}
            </ListItem>
          )}
          {accountInstructionDetails?.gcpProjectID && (
            <>
              {gcpBootstrapShellCommand ? (
                <Box>
                  <BodyText>
                    Please open the Google Cloud Shell environment using the
                    following link {gcpCloudShellLink} . Once the terminal is
                    open, execute the following command:
                  </BodyText>

                  <TextContainerToCopy text={gcpBootstrapShellCommand} />

                  <BodyText sx={{ marginTop: "20px" }}>
                    For guidance our instructional video is {shellScriptGuide}.
                  </BodyText>
                </Box>
              ) : (
                <BodyText>
                  Your Google cloud script is being configured. Please check
                  back shortly for detailed setup instructions.
                </BodyText>
              )}
            </>
          )}
        </List>
      </Box>
    </>
  );
};

function CloudProviderAccountOrgIdModal({
  open,
  handleClose,
  isAccountCreation,
  accountConfigMethod,
  cloudFormationTemplateUrl,
  isAccessPage = false,
  accountConfigId,
  selectedAccountConfig,
  gcpBootstrapShellCommand,
  accountInstructionDetails,
}) {
  const gcpCloudShellLink = (
    <StyledLink
      href="https://shell.cloud.google.com/?cloudshell_ephemeral=true&show=terminal"
      target="_blank"
      rel="noopener noreferrer"
    >
      Google Cloud Shell
    </StyledLink>
  );

  const cloudformationlink = (
    <StyledLink
      href={cloudFormationTemplateUrl ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  );

  const shellScriptGuide = isAccessPage ? (
    <StyledLink
      href="https://youtu.be/isTGi8tQA2w?si=a12mJXnlA-y2ipVC"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  ) : (
    <StyledLink
      href="https://youtu.be/isTGi8tQA2w?si=a12mJXnlA-y2ipVC"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  );

  const cloudFormationGuide = isAccessPage ? (
    <StyledLink
      href="https://youtu.be/c3HNnM8UJBE"
      target="_blank"
      rel="noopener noreferrer"
    >
      {isAccountCreation ? "here" : "guide"}
    </StyledLink>
  ) : (
    <StyledLink
      href="https://youtu.be/Mu-4jppldwk"
      target="_blank"
      rel="noopener noreferrer"
    >
      {isAccountCreation ? "here" : "guide"}
    </StyledLink>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"tablet"}>
      <StyledContainer>
        <Header>
          <Stack direction="row" alignItems="center" gap="16px">
            <Box
              sx={{
                border: "1px solid #E4E7EC",
                boxShadow:
                  "0px 1px 2px 0px #1018280D, 0px -2px 0px 0px #1018280D,0px 0px 0px 1px #1018282E",
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
              {isAccountCreation ||
              !STATUS_TITLE_MAP[selectedAccountConfig?.status]
                ? "Account Configuration Instructions"
                : STATUS_TITLE_MAP[selectedAccountConfig?.status]}
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon sx={{ color: "#98A2B3" }} />
          </IconButton>
        </Header>
        <Content>
          {isAccountCreation ? (
            <CreationTimeInstructions
              accountConfigMethod={accountConfigMethod}
              cloudformationlink={cloudformationlink}
              cloudFormationGuide={cloudFormationGuide}
              accountConfigStatus={selectedAccountConfig?.status}
              accountConfigId={accountConfigId}
              cloudFormationTemplateUrl={cloudFormationTemplateUrl}
              gcpBootstrapShellCommand={gcpBootstrapShellCommand}
              gcpCloudShellLink={gcpCloudShellLink}
              shellScriptGuide={shellScriptGuide}
              accountInstructionDetails={accountInstructionDetails}
            />
          ) : (
            <NonCreationTimeInstructions
              selectedAccountConfig={selectedAccountConfig}
              cloudformationlink={cloudformationlink}
              cloudFormationGuide={cloudFormationGuide}
              cloudFormationTemplateUrl={cloudFormationTemplateUrl}
              gcpBootstrapShellCommand={gcpBootstrapShellCommand}
              gcpCloudShellLink={gcpCloudShellLink}
              shellScriptGuide={shellScriptGuide}
              accountInstructionDetails={accountInstructionDetails}
            />
          )}
        </Content>
        <Footer>
          <Button
            variant="contained"
            onClick={handleClose}
            data-testid="close-button"
            fullWidth
          >
            Close
          </Button>
        </Footer>
      </StyledContainer>
    </Dialog>
  );
}

export default CloudProviderAccountOrgIdModal;
