import { linearProgressClasses, styled } from "@mui/material";
import MuiLinearProgress from "@mui/material/LinearProgress";

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
      backgroundColor: "#7F56D9",
    },
  })
);

export default LinearProgress;
