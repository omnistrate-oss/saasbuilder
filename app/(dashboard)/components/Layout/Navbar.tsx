"use client";

// import Notifications from "./Notifications";
import { Stack } from "@mui/material";

import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useUserData from "src/hooks/usersData";
import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";
import EnvironmentTypeChip from "components/EnvironmentTypeChip/EnvironmentTypeChip";
import Logo from "components/NonDashboardComponents/Logo";

import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const environmentType = useEnvironmentType();
  const { orgName, orgLogoURL } = useProviderOrgDetails();

  // Set User Data
  useUserData();

  return (
    <div className="py-4 px-8 flex items-center justify-between gap-2 border-b border-[#E9EAEB] z-30">
      <div className="flex items-center gap-4">
        {orgLogoURL ? <Logo src={orgLogoURL} alt={orgName} /> : ""}
        {environmentType && environmentType !== ENVIRONMENT_TYPES.PROD && <EnvironmentTypeChip />}
      </div>

      <Stack direction="row" alignItems="center" gap="16px">
        {/* <Notifications /> */}
        <ProfileDropdown />
      </Stack>
    </div>
  );
};

export default Navbar;
