import { CircularProgress, Stack } from "@mui/material";

function LoadingSpinner() {
  return (
    <Stack alignItems="center">
      <CircularProgress sx={{ marginTop: "200px", marginBottom: "200px" }} />
    </Stack>
  );
}

export default LoadingSpinner;
