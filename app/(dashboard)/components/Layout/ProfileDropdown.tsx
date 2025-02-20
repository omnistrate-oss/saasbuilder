import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Stack, styled } from "@mui/material";

import { colors } from "src/themeConfig";
import useLogout from "src/hooks/useLogout";
import { styleConfig } from "src/providerConfig";
import { selectUserData } from "src/slices/userDataSlice";

import Menu from "components/Menu/Menu";
import MenuItem from "components/MenuItem/MenuItem";
import { Text } from "components/Typography/Typography";
import LogoutIcon from "components/Icons/Logout/LogoutIcon";
import EllipsisTooltipText from "components/Tooltip/EllipsisTooltip";

import profile_icon from "public/assets/images/dashboard/avatar.jpeg";

const UserName = styled("div")({
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: 600,
  color: styleConfig.navbarTextColor,
});

const Avatar = styled(Image)({
  borderRadius: "50%",
  height: 32,
  width: 32,
  objectFit: "cover",
});

const ProfileDropdown = () => {
  const { logout } = useLogout();
  const userAllData = useSelector(selectUserData);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", gap: "11px", alignItems: "center" }}>
      <UserName>{Object.values(userAllData)[0]?.name}</UserName>

      <Avatar
        src={profile_icon}
        alt="avatar"
        sx={{
          cursor: "pointer",
          outline: open ? `2px solid ${colors.blue700}` : "none",
          outlineOffset: "2px",
          transition: "outline 0.1s",
        }}
        onClick={handleMenuOpen}
      />

      <Menu
        anchorEl={anchorEl}
        id="#profile-menu"
        open={open}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
        sx={{
          boxShadow: "0px 4px 6px -2px #10182808 0px 12px 16px -4px #10182814",
          ".MuiMenu-list": {
            borderRadius: "8px",
            border: "1px solid #EAECF0",
            padding: 0,
          },
        }}
      >
        <MenuItem
          key="userInfo"
          sx={{
            padding: "12px 16px",
            borderBottom: "1px solid #EAECF0",
            cursor: "auto",
            width: "100%",
            minWidth: "250px",
          }}
          disableRipple
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            gap="12px"
          >
            <Avatar
              src={profile_icon}
              alt="avatar-two"
              sx={{
                width: "40px",
                height: "40px",
                flexShrink: 0,
              }}
            />
            <Stack sx={{ flex: 1, overflow: "hidden" }}>
              {/* @ts-ignore */}
              <EllipsisTooltipText
                weight="semibold"
                color="#344054"
                text={Object.values(userAllData)[0]?.name}
              />

              {/* @ts-ignore */}
              <EllipsisTooltipText
                weight="regular"
                color="#475467"
                text={Object.values(userAllData)[0]?.email}
              />
            </Stack>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={logout}
          sx={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "8px",
            borderTop: "1px solid #EAECF0",
          }}
        >
          <LogoutIcon />
          <Text weight="medium" size="small" color="#344054">
            Log out
          </Text>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileDropdown;
