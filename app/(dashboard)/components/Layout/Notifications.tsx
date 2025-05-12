"use client";

import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import Button from "src/components/Button/Button";
import BellIcon from "src/components/Icons/Bell/BellIcon";
import Popover from "src/components/Popover/Popover";
import { Text } from "src/components/Typography/Typography";
import { styleConfig } from "src/providerConfig";
import { colors } from "src/themeConfig";

const NotificationItem = () => {
  return (
    <div className="flex gap-2">
      <ChevronRightIcon className="flex-shrink-0" />
      <Text size="small" weight="semibold" color="#414651">
        Your deployment will upgrade at{" "}
        <span
          style={{
            color: styleConfig.secondaryColor,
          }}
        >
          2024-10-11 17:50:11 UTC.
        </span>
      </Text>
    </div>
  );
};

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Button
        varaiant="outlined"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
        disableRipple
        sx={{
          position: "relative",
          width: "44px",
          height: "44px",
          px: "10px !important",
          outline: anchorEl ? "2px solid #16B364" : "none",
          "&:hover": {
            backgroundColor: `${colors.green50} !important`,
          },
        }}
      >
        <BellIcon />
        <div className="bg-[#D92D20] w-1.5 h-1.5 rounded-full absolute top-2 right-2.5" />
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "8px" }}
      >
        <div className="py-3 px-4 border-b border-[#E9EAEB] w-80">
          <Text size="small" weight="semibold" color={styleConfig.secondaryColor}>
            Alerts
          </Text>
        </div>

        <div className="py-3 px-4 min-h-24 w-80 space-y-4">
          {/* <Text
            size="small"
            weight="semibold"
            color="#414651"
            sx={{ textAlign: "center", mt: "24px" }}
          >
            No new alerts
          </Text> */}
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
        </div>
      </Popover>
    </>
  );
};

export default Notifications;
