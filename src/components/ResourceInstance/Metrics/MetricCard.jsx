import { Stack } from "@mui/material";
import Card from "components/Card/Card";
import { Text } from "components/Typography/Typography";
import { colors } from "src/themeConfig";

function MetricCard(props) {
  const { title = "", value = "", unit = "" } = props;

  return (
    <Card
      flex="1"
      sx={{
        padding: "18px",
        boxShadow: "0px 1px 2px 0px #0A0D120D",
        borderRadius: "12px",
        border: "2px solid #E9EAEB",
      }}
    >
      <Text
        size="small"
        color="#535862"
        weight="semibold"
        sx={{ textAlign: "center" }}
      >
        {title}
      </Text>
      <Stack
        direction="row"
        justifyContent="center"
        mt="8px"
        alignItems="baseline"
      >
        <Text
          size="large"
          color={colors.blue700}
          weight="semibold"
          sx={{ textAlign: "center" }}
        >
          {value}
        </Text>
        {value !== "" && unit && (
          <Text
            size="large"
            color={colors.blue700}
            weight="semibold"
            sx={{ ml: "4px" }}
          >
            {unit}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default MetricCard;
