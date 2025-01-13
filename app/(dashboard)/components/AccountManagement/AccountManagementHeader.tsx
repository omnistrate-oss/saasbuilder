import clsx from "clsx";
import { FC } from "react";
import { DisplayText, Text } from "components/Typography/Typography";

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
      <div className="h-[140px] w-full bg-gradient-to-b from-[#A5C0EE] to-[#FBC5EC]" />

      <div
        className={clsx("flex items-end gap-6 px-8 -mt-6", className)}
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
