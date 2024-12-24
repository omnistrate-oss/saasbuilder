import { styled } from "@mui/material";
import Image from "next/image";
import noProductTierIcon from "../../../public/assets/images/dashboard/no-services.png";
import Card from "../Card/Card";
import { Text } from "../Typography/Typography";

function NoProductTierUI() {
  return (
    <Container
      sx={{ paddingTop: "130px", paddingBottom: "130px", marginTop: "30px" }}
    >
      <Container
        sx={{
          boxShadow: "none",
          maxWidth: "520px",
          marginInline: "auto",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Text size="xlarge" color="#98A2B3" weight="medium" textAlign="center">
          No subscription plans found.
          <br />
        </Text>
        <Image src={noProductTierIcon} alt="no-services-available" />
        <br />
      </Container>
    </Container>
  );
}

export default NoProductTierUI;

const Container = styled(Card)(() => ({
  padding: "20px",
  boxShadow:
    "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
  borderRadius: "12px",
}));
