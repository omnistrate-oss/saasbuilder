import { Box } from "@mui/material";

import Card from "src/components/Card/Card";

const ServiceOfferingUnavailableUI = () => {
  return (
    <Card mt={3} style={{ height: "700px", width: "100%" }}>
      <Box>
        <Box mt="-300px">
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "50px",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            SaaS Product
          </div>
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            not available
          </div>
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          />
          <div
            justifyContent="center"
            align="center"
            style={{
              marginTop: "100px",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default ServiceOfferingUnavailableUI;
