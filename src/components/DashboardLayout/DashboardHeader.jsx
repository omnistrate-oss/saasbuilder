import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/useLogout";
import useUserData from "../../hooks/usersData";
import ProfileDropdown from "./ProfileDropdown";
import { selectUserData } from "src/slices/userDataSlice";
import { styleConfig } from "src/providerConfig";
import ServicesDropdown from "./ServicesDropdown";
import useBillingDetails from "src/hooks/query/useBillingDetails";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import EnvironmentTypeChip from "../EnvironmentTypeChip/EnvironmentTypeChip";
import { useRef } from "react";
import Tooltip from "../Tooltip/Tooltip";

function DashboardHeader(props) {
  const {
    marketplacePage,
    accessPage,
    currentSubscription,
    serviceName,
    serviceLogoURL,
    noServicesAvailable,
  } = props;
  const serviceNameRef = useRef();
  useUserData();
  //prefetch billing data
  useBillingDetails();
  const userAllData = useSelector(selectUserData);
  const { logout } = useLogout();
  const environmentType = useEnvironmentType();

  let shouldShowTooltipOnServiceName = false;
  if (serviceNameRef.current) {
    if (
      serviceNameRef.current.offsetWidth < serviceNameRef.current.scrollWidth
    ) {
      shouldShowTooltipOnServiceName = true;
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height="72px"
      pl="25px"
      pr="30px"
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      zIndex="100"
      sx={{
        backgroundColor: styleConfig.navbarBg,
        borderBottom: `1px solid ${styleConfig.navbarBorderColor}`,
      }}
    >
      <Stack direction="row" alignItems="center">
        <Box
          pr="20px"
          sx={{ display: "flex", direction: "row", alignItems: "center" }}
        >
          <ServicesDropdown />
        </Box>

        <Stack direction="row" alignItems="center" gap="10px" pr="16px">
          {(serviceName || noServicesAvailable) && serviceLogoURL && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={
                serviceLogoURL ||
                "/assets/images/dashboard/service/servicePlaceholder.png"
              }
              height={28}
              style={{ maxHeight: "28px", width: "auto", maxWidth: "180px" }}
              alt="service-logo"
            />
          )}
          {serviceName && (
            <Tooltip
              isVisible={shouldShowTooltipOnServiceName}
              title={serviceName}
            >
              <Box
                component="p"
                ref={serviceNameRef}
                sx={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 600,
                  width: "100%",
                  maxWidth: "260px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "block",
                  color: styleConfig.navbarTextColor,
                }}
              >
                {serviceName}
              </Box>
            </Tooltip>
          )}
          {environmentType &&
            environmentType !== ENVIRONMENT_TYPES.PROD &&
            (serviceName || noServicesAvailable) && <EnvironmentTypeChip />}
        </Stack>
      </Stack>

      <ProfileDropdown
        userAllData={userAllData}
        logout={logout}
        accessPage={accessPage}
        marketplacePage={marketplacePage}
        currentSubscription={currentSubscription}
      />
    </Box>
  );
}

export default DashboardHeader;
