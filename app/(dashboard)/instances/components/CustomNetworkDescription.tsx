import { Box } from "@mui/material";
import { StyledListItem } from "app/(dashboard)/cloud-accounts/components/CustomLabelDescription";
import { getCustomNetworksRoute } from "src/utils/routes";

const CustomNetworkDescription = ({ overlay }) => {
  return (
    <Box mt="8px">
      <StyledListItem
        text="Don't have a Custom Network?"
        link={getCustomNetworksRoute({
          overlay,
        })}
      />
    </Box>
  );
};

export default CustomNetworkDescription;
