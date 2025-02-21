import { Box } from "@mui/material";

const ZoneIcon = (props) => {
  return (
    <Box
      sx={{
        width: "28px",
        height: "28px",
        borderRadius: "4px",
        border: "1px solid #E9EAEB",
        boxShadow: "0px 1px 2px 0px #0A0D120D",
        display: "flex !important",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={19}
        height={18}
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M3.83301 10.9051C2.29021 11.5857 1.33301 12.5341 1.33301 13.5832C1.33301 15.6542 5.06397 17.3332 9.66634 17.3332C14.2687 17.3332 17.9997 15.6542 17.9997 13.5832C17.9997 12.5341 17.0425 11.5857 15.4997 10.9051M14.6663 5.6665C14.6663 9.05293 10.9163 10.6665 9.66634 13.1665C8.41634 10.6665 4.66634 9.05293 4.66634 5.6665C4.66634 2.90508 6.90492 0.666504 9.66634 0.666504C12.4278 0.666504 14.6663 2.90508 14.6663 5.6665ZM10.4997 5.6665C10.4997 6.12674 10.1266 6.49984 9.66634 6.49984C9.2061 6.49984 8.83301 6.12674 8.83301 5.6665C8.83301 5.20627 9.2061 4.83317 9.66634 4.83317C10.1266 4.83317 10.4997 5.20627 10.4997 5.6665Z"
          stroke="#0E5FB5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

export default ZoneIcon;
