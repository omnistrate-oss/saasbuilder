import { Box } from "@mui/material";

const SignupNotification = ({ isVisible }) => {
  return (
    <Box
      position="fixed"
      left="0"
      right="0"
      top="0"
      textAlign="center"
      padding="18px"
      sx={{
        zIndex: "100",
        backgroundColor: "#2A8A00",
        fontWeight: 600,
        fontSize: "16px",
        color: "white",
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      Thank you for signing up! We have sent a confirmation link to your email. Click the link to activate your account
    </Box>
  );
};

export default SignupNotification;
