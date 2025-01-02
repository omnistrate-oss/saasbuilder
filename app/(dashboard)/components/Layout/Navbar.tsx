"use client";

import useEnvironmentType from "src/hooks/useEnvironmentType";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";

import Logo from "components/NonDashboardComponents/Logo";
import EnvironmentTypeChip from "components/EnvironmentTypeChip/EnvironmentTypeChip";

import ProfileDropdown from "./ProfileDropdown";
import useUserData from "src/hooks/usersData";

const Navbar = () => {
  const environmentType = useEnvironmentType();
  const { orgName, orgLogoURL } = useProviderOrgDetails();

  // Set User Data
  useUserData();

  return (
    <div className="py-4 px-8 flex items-center justify-between gap-2 border-b border-[#E9EAEB]">
      <div className="flex items-center gap-4">
        {orgLogoURL ? <Logo src={orgLogoURL} alt={orgName} /> : ""}
        {environmentType && environmentType !== ENVIRONMENT_TYPES.PROD && (
          <EnvironmentTypeChip />
        )}
      </div>

      <ProfileDropdown />
    </div>
  );
};

export default Navbar;
