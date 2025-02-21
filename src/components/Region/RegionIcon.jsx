import { Box } from "@mui/material";

const RegionIcon = (props) => {
  return (
    <Box
      sx={{
        width: "28px",
        height: "28px",
        borderRadius: "4px",
        border: "1px solid #E9EAEB",
        // boxShadow:
        //   "0px 1px 2px 0px #0A0D120D, 0px -2px 0px 0px #0A0D120D inset, 0px 0px 0px 1px #0A0D122E inset",
        boxShadow: "0px 1px 2px 0px #0A0D120D",
        display: "flex !important",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M8.99984 0.666504C11.0842 2.94846 12.2688 5.90987 12.3332 8.99984C12.2688 12.0898 11.0842 15.0512 8.99984 17.3332M8.99984 0.666504C6.91544 2.94846 5.73088 5.90987 5.6665 8.99984C5.73088 12.0898 6.91544 15.0512 8.99984 17.3332M8.99984 0.666504C4.39746 0.666504 0.666504 4.39746 0.666504 8.99984C0.666504 13.6022 4.39746 17.3332 8.99984 17.3332M8.99984 0.666504C13.6022 0.666504 17.3332 4.39746 17.3332 8.99984C17.3332 13.6022 13.6022 17.3332 8.99984 17.3332M1.08319 6.49984H16.9165M1.08317 11.4998H16.9165"
          stroke="#0E5FB5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

export default RegionIcon;
