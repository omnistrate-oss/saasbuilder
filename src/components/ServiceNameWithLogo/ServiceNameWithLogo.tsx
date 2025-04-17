import { Box, SxProps } from "@mui/material";
import GridCellExpand from "../GridCellExpand/GridCellExpand";

type ServiceNameWithLogoProps = {
  serviceName?: string;
  serviceLogoURL?: string;
  onClick?: () => void;
  textStyles?: SxProps;
};

const ServiceNameWithLogo: React.FC<ServiceNameWithLogoProps> = ({
  serviceName,
  serviceLogoURL,
  onClick = () => {},
  textStyles = {},
}) => {
  return (
    <GridCellExpand
      value={serviceName || ""}
      textStyles={{
        color: "#101828",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
        ...textStyles,
      }}
      onClick={onClick}
      startIcon={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
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
            style={{ objectFit: "cover", objectPosition: "center" }}
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
