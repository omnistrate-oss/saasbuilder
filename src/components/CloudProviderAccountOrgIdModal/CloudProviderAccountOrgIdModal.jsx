import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";
import Button from "src/components/Button/Button";
import { Text } from "src/components/Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import InstructionsModalIcon from "../Icons/AccountConfig/InstructionsModalIcon";
import CopyToClipboardButton from "../CopyClipboardButton/CopyClipboardButton";
import ArrowBulletIcon from "../Icons/ArrowIcon/ArrowBulletIcon";

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
  top: "0",
  right: "50%",
  transform: "translateX(50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow:
    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
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

const ListItemIcon = styled(Box)({
  flexShrink: 0,
});

const BodyText = ({ children, ...restProps }) => {
  return (
    <Text size="small" weight="medium" color="#344054" {...restProps}>
      {children}
    </Text>
  );
};

const OrgIdContainer = (props) => {
  const { orgId } = props;
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
        <Text size="medium" weight="medium" color="#667085" ellipsis>
          {orgId}
        </Text>

        <CopyToClipboardButton text={orgId} iconProps={{ color: "#98A2B3" }} />
      </Box>
    </Box>
  );
};

const CreationTimeInstructions = (props) => {
  const {
    accountConfigMethod,
    cloudformationlink,
    terraformlink,
    cloudFormationGuide,
    terraformGuide,
    orgId,
    accountConfigStatus,
    cloudFormationTemplateUrl,
    cloudformationNoLBlink,
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

  if (accountConfigMethod === "CloudFormation") {
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
        <BodyText>
          Your account details have been saved. To complete the setup please
          create your CloudFormation Stack using the provided template{" "}
          {cloudformationlink}.
        </BodyText>

        <BodyText sx={{ marginTop: "24px" }}>
          If an existing AWSLoadBalancerControllerIAMPolicy policy causes an
          error while creating the CloudFormation stack, use{" "}
          {cloudformationNoLBlink} CloudFormation template instead.
        </BodyText>
        <BodyText sx={{ marginTop: "24px" }}>
          For guidance, our instructional video is available{" "}
          {cloudFormationGuide}.
        </BodyText>
      </>
    );
  }

  return (
    <>
      <BodyText>
        Your account details have been saved. To complete the setup execute the
        Terraform scripts available {terraformlink}, by using the Account Config
        Identity ID below.
      </BodyText>
      <OrgIdContainer orgId={orgId} />

      <BodyText sx={{ marginTop: "24px" }}>
        For guidance, our instructional video is available {terraformGuide}.
      </BodyText>
    </>
  );
};

const NonCreationTimeInstructions = (props) => {
  const {
    viewInstructionsItem,
    accountConfigMethod,
    terraformlink,
    cloudformationlink,
    cloudFormationGuide,
    terraformGuide,
    orgId,
    cloudFormationTemplateUrl,
    cloudformationNoLBlink,
  } = props;

  return (
    <>
      <Box width={"100%"} mb="30px">
        <BodyText>
          {STATUS_DESCRIPTION_MAP[viewInstructionsItem?.status] ??
            "To complete the account configuration setup -"}{" "}
        </BodyText>

        <List>
          {(!accountConfigMethod ||
            accountConfigMethod === "CloudFormation") && (
            <ListItem>
              <ListItemIcon>
                <ArrowBulletIcon />
              </ListItemIcon>

              {cloudFormationTemplateUrl ? (
                <>
                  <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
                    <BodyText>
                      <b>For AWS CloudFormation users:</b> Please create your
                      CloudFormation Stack using the provided template{" "}
                      {cloudformationlink}. Watch the CloudFormation{" "}
                      {cloudFormationGuide} for help.
                    </BodyText>
                    <BodyText>
                      If an existing AWSLoadBalancerControllerIAMPolicy policy
                      causes an error while creating the CloudFormation stack,
                      use {cloudformationNoLBlink} CloudFormation template
                      instead.
                    </BodyText>
                  </Box>
                </>
              ) : (
                <BodyText>
                  <b>For AWS CloudFormation users:</b> Your CloudFormation Stack
                  is being configured. Please check back shortly for detailed
                  setup instructions.
                </BodyText>
              )}
            </ListItem>
          )}
          {(!accountConfigMethod || accountConfigMethod === "Terraform") && (
            <ListItem>
              <ListItemIcon>
                <ArrowBulletIcon />
              </ListItemIcon>

              <BodyText>
                <b>For AWS/GCP Terraform users:</b> Execute the Terraform
                scripts available {terraformlink}, by using the Account Config
                Identity ID below. For guidance our Terraform instructional
                video is {terraformGuide}.
              </BodyText>
            </ListItem>
          )}
        </List>
      </Box>

      <OrgIdContainer orgId={orgId} />
    </>
  );
};

const CloudFormationLink = ({ cloudFormationTemplateUrl }) => {
  const updateTemplateURL = (url) => {
    // Parse the base URL and hash part
    const [baseURL, hashPart] = url.split("#");
    if (!hashPart) {
      return url; // No hash part found, return the original URL
    }

    // Parse the hash part to get the path and query parameters
    const [basePath, queryParams] = hashPart.split("?");
    const basePaths = queryParams.replace(
      "account-config-setup-template.yaml",
      "account-config-setup-no-lb-policy.yaml"
    );

    const hashParams = new URLSearchParams(basePaths);

    // // Manually construct the query string to avoid encoding issues
    const newQueryParams = Array.from(hashParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Reconstruct the hash part with updated parameters
    const newHashPart = `${basePath}?${newQueryParams}`;

    return `${baseURL}#${newHashPart}`;
  };

  const updatedUrl = cloudFormationTemplateUrl
    ? updateTemplateURL(cloudFormationTemplateUrl)
    : "";

  return (
    <StyledLink href={updatedUrl} target="_blank" rel="noopener noreferrer">
      this
    </StyledLink>
  );
};

function CloudProviderAccountOrgIdModal(props) {
  const {
    open,
    handleClose,
    orgId,
    isAccountCreation,
    accountConfigMethod,
    cloudFormationTemplateUrl,
    cloudProvider,
    isAccessPage = false,
    downloadTerraformKitMutation,
    accountConfigStatus,
    accountConfigId,
    service,
    selectedResourceKey,
    subscriptionId,
    setCloudFormationTemplateUrl,
    setCloudFormationTemplateUrlNoLB,
    fetchResourceInstancesOfSelectedResource,
    cloudFormationTemplateUrlNoLB,
    viewInstructionsItem,
  } = props;

  const terraformlink = isAccessPage ? (
    <>
      <Box
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "#7F56D9",
          fontWeight: 600,
        }}
        component="span"
        onClick={() => {
          downloadTerraformKitMutation.mutate();
        }}
      >
        here
      </Box>
      {downloadTerraformKitMutation.isLoading && (
        <LoadingSpinnerSmall sx={{ color: "black", ml: "16px" }} size={12} />
      )}
    </>
  ) : (
    <StyledLink
      href="https://github.com/omnistrate-oss/account-setup"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
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

  const cloudFormationTemplateUrlNoLBLink = (
    <StyledLink
      href={cloudFormationTemplateUrlNoLB ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      this
    </StyledLink>
  );

  const terraformGuide = isAccessPage ? (
    <StyledLink
      href="https://youtu.be/l6lMEZdMMxs"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  ) : (
    <StyledLink
      href="https://youtu.be/eKktc4QKgaA"
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
              !STATUS_TITLE_MAP[viewInstructionsItem?.status]
                ? "Account Configuration Instructions"
                : STATUS_TITLE_MAP[viewInstructionsItem?.status]}
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
              terraformlink={terraformlink}
              cloudFormationGuide={cloudFormationGuide}
              terraformGuide={terraformGuide}
              orgId={orgId}
              accountConfigStatus={accountConfigStatus}
              accountConfigId={accountConfigId}
              cloudFormationTemplateUrl={cloudFormationTemplateUrl}
              setCloudFormationTemplateUrl={setCloudFormationTemplateUrl}
              setCloudFormationTemplateUrlNoLB={
                setCloudFormationTemplateUrlNoLB
              }
              service={service}
              selectedResourceKey={selectedResourceKey}
              subscriptionId={subscriptionId}
              fetchResourceInstancesOfSelectedResource={
                fetchResourceInstancesOfSelectedResource
              }
              cloudformationNoLBlink={
                cloudFormationTemplateUrlNoLB ? (
                  cloudFormationTemplateUrlNoLBLink
                ) : (
                  <CloudFormationLink
                    cloudFormationTemplateUrl={cloudFormationTemplateUrl}
                  />
                )
              }
            />
          ) : (
            <NonCreationTimeInstructions
              isAccessPage={isAccessPage}
              viewInstructionsItem={viewInstructionsItem}
              accountConfigMethod={accountConfigMethod}
              cloudProvider={cloudProvider}
              cloudformationlink={cloudformationlink}
              terraformlink={terraformlink}
              cloudFormationGuide={cloudFormationGuide}
              terraformGuide={terraformGuide}
              orgId={orgId}
              cloudFormationTemplateUrl={cloudFormationTemplateUrl}
              cloudformationNoLBlink={
                cloudFormationTemplateUrlNoLB ? (
                  cloudFormationTemplateUrlNoLBLink
                ) : (
                  <CloudFormationLink
                    cloudFormationTemplateUrl={cloudFormationTemplateUrl}
                  />
                )
              }
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
