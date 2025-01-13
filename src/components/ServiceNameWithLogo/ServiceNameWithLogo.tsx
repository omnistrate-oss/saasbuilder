import { Box } from "@mui/material";
import GridCellExpand from "../GridCellExpand/GridCellExpand";

type ServiceNameWithLogoProps = {
  serviceName?: string;
  serviceLogoURL?: string;
  onClick?: () => void;
};

const ServiceNameWithLogo: React.FC<ServiceNameWithLogoProps> = ({
  serviceName,
  serviceLogoURL,
  onClick = () => {},
}) => {
  return (
    <GridCellExpand
      value={serviceName || ""}
      textStyles={{
        color: "#101828",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
        cursor: "pointer",
      }}
      onClick={onClick}
      startIcon={
        <Box
          boxShadow="0px 1px 2px 0px #1018280D"
          borderRadius="50%"
          border="1px solid rgba(0, 0, 0, 0.08)"
          overflow="hidden"
          width="40px"
          height="40px"
          flexShrink={0}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="38"
            height="38"
            style={{ objectFit: "cover" }}
            src={
              serviceLogoURL ||
              "/assets/images/dashboard/service/servicePlaceholder.png"
            }
            alt={serviceName}
          />
        </Box>
      }
    />
  );
};

export default ServiceNameWithLogo;