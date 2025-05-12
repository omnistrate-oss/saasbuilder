import { Box } from "@mui/material";

const FieldLabel = ({ required, children }) => {
  return (
    <Box
      component="label"
      sx={{
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "20px",
        color: "#111827",
      }}
    >
      {children}{" "}
      {required && (
        <Box component="span" color="#E03137">
          *
        </Box>
      )}
    </Box>
  );
};

export default FieldLabel;
