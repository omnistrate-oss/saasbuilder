import MuiLinearProgress from "@mui/material/LinearProgress";
import { linearProgressClasses, styled } from "@mui/material";
import { colors } from "src/themeConfig";

const LinearProgress = styled(MuiLinearProgress, {
  shouldForwardProp: (prop) => !["height"].includes(prop),
})(
  (
    {
      // theme,
      // height = 10
    }
  ) => ({
    borderRadius: 5,
    [`&.${linearProgressClasses.root}`]: {
      height: 7,
    },
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#EAECF0",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: colors.blue600,
    },
  })
);

export default LinearProgress;
