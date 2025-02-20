import { FC } from "react";
import { DisplayText, Text } from "components/Typography/Typography";
import { cn } from "lib/utils";
import settingsImg from "public/assets/images/dashboard/settings.jpg";
import Image from "next/image";
import { styled } from "@mui/material";

const StyledImage = styled(Image)({
  width: "100%",
  height: "100%",
  objectPosition: "center",
  objectFit: "cover",
});

type AccountManagementHeaderProps = {
  userName?: string;
  userEmail?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const AccountManagementHeader: FC<AccountManagementHeaderProps> = ({
  userName,
  userEmail,
  className,
  ...otherProps
}) => {
  return (
    <div>
      <div className="w-full h-[140px]">
        <StyledImage src={settingsImg} alt="settings-img" />
      </div>

      <div
        className={cn("flex items-end gap-6 px-8 -mt-6", className)}
        {...otherProps}
      >
        <div className="w-24 h-24 rounded-full border-4 border-white bg-[#DEE4E4] flex items-center justify-center">
          {/* @ts-ignore */}
          <DisplayText size="large" weight="medium">
            {userName ? userName.charAt(0).toUpperCase() : ""}
          </DisplayText>
        </div>

        <div className="space-y-1">
          {/* @ts-ignore */}
          <DisplayText size="xsmall" weight="semibold" color="#181D27">
            {userName ? userName : ""}
          </DisplayText>

          <Text size="medium" weight="regular" color="#535862">
            {userEmail ? userEmail : ""}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AccountManagementHeader;
