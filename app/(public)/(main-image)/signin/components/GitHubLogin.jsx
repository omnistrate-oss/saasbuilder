import SSOLoginButton from "./SSOLoginButton";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Box } from "@mui/material";
import GithubLoginIcon from "src/components/Icons/GithubLogin/GithubLogin";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { IDENTITY_PROVIDER_TYPES } from "../constants";

function GithubLogin(props) {
  const {
    disabled,
    githubClientID,
    saasBuilderBaseURL,
    invitationInfo = {},
    destination,
  } = props;
  const router = useRouter();

  function handleGitHubLogin() {
    const uuid = uuidv4();
    const githubAuthState = {
      nonce: uuid,
      destination,
      identityProvider: IDENTITY_PROVIDER_TYPES.GitHub,
    };
    const encodedGithubAuthState = Buffer.from(
      JSON.stringify(githubAuthState),
      "utf8"
    ).toString("base64");

    const localAuthState = { ...githubAuthState, invitationInfo };
    //encode to base64 before storing in session storage
    const encodedLocalAuthState = Buffer.from(
      JSON.stringify(localAuthState),
      "utf8"
    ).toString("base64");

    sessionStorage.setItem("authState", encodedLocalAuthState);

    router.push(
      `https://github.com/login/oauth/authorize?client_id=${githubClientID}&scope=user:email&redirect_uri=${saasBuilderBaseURL}/idp-auth&state=${encodedGithubAuthState}`
    );
  }

  return (
    <Tooltip
      isVisible={disabled}
      title="Temporarily Unavailable"
      placement="top"
    >
      <Box>
        <SSOLoginButton
          onClick={() => {
            handleGitHubLogin();
          }}
          disabled={disabled}
        >
          <GithubLoginIcon disabled={disabled} />
        </SSOLoginButton>
      </Box>
    </Tooltip>
  );
}

export default GithubLogin;
