import { Box } from "@mui/material";
import { StyledListItem } from "app/(dashboard)/cloud-accounts/components/CustomLabelDescription";

import { getCloudAccountsRoute } from "src/utils/routes";

const AccountConfigDescription = ({ serviceId, servicePlanId, subscriptionId }) => {
  return (
    <Box mt="8px">
      <StyledListItem
        text="Don't have an Account?"
        link={getCloudAccountsRoute({
          serviceId,
          servicePlanId,
          subscriptionId,
        })}
      />
    </Box>
  );
};

export default AccountConfigDescription;
