import React from "react";
import Image from "next/image";
import { Box } from "@mui/material";

import marketplaceIcon from "public/assets/images/dashboard/marketplace.svg";

import Card from "../Card/Card";

function SubscriptionNotFoundUI({ isOfferingFound }) {
  return (
    <Card mt={3} style={{ height: "700px", width: "100%" }}>
      <Box>
        <Image style={{ height: "500px", width: "100%", marginTop: "50px" }} src={marketplaceIcon} alt="image-icon" />
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
            {isOfferingFound ? "Subscription" : "Service Offering"}
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
            not found
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
}

export default SubscriptionNotFoundUI;
