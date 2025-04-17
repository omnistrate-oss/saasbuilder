"use client";

import { cn } from "lib/utils";
import { Text } from "components/Typography/Typography";

import { colors } from "src/themeConfig";
import { cloudProviderLabels } from "src/constants/cloudProviders";

import AWSLogo from "../Icons/AWSLogo";
import GCPFullLogo from "../Icons/GCPFullLogo";
import AzureFullLogo from "../Icons/AzureFullLogo";

export const cloudProviderFullLogoMap = {
  aws: <AWSLogo height="36px" width="auto" />,
  gcp: <GCPFullLogo height="26px" width="auto" />,
  azure: <AzureFullLogo height="34px" width="auto" />,
};

const CloudProviderCard = ({
  cloudProvider,
  isSelected,
  onClick,
  disabled,
}) => {
  return (
    <div
      data-testid={`${cloudProvider}-card`}
      className={cn(
        "px-4 py-4 rounded-xl text-center flex flex-col justify-between items-center min-h-28",
        disabled ? "cursor-default bg-gray-50" : "cursor-pointer"
      )}
      style={{
        outline: isSelected
          ? `2px solid ${colors.success500}`
          : `1px solid ${colors.gray200}`,
      }}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {cloudProviderFullLogoMap[cloudProvider]}
      <Text
        size="small"
        weight="medium"
        color={disabled ? "#667085" : "#414651"}
      >
        {cloudProviderLabels[cloudProvider]}
      </Text>
    </div>
  );
};

type CloudProviderRadioProps = {
  cloudProviders: string[];
  formData: any;
  name: string;
  onChange?: () => void;
  disabled?: boolean;
};

const CloudProviderRadio: React.FC<CloudProviderRadioProps> = ({
  cloudProviders,
  formData,
  name,
  onChange = () => {},
  disabled,
}) => {
  if (!cloudProviders.length) {
    return (
      <div className="flex items-center justify-center h-10">
        <Text size="small" weight="medium" color={colors.gray500}>
          No cloud providers available
        </Text>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-8", `grid-cols-${cloudProviders.length}`)}>
      {cloudProviders.map((cloudProvider, index) => {
        return (
          <CloudProviderCard
            key={index}
            disabled={disabled}
            cloudProvider={cloudProvider}
            isSelected={
              formData.values[name]?.toLowerCase() ===
              cloudProvider.toLowerCase()
            }
            onClick={() => {
              formData.setFieldValue(name, cloudProvider);
              if (formData.values[name] !== cloudProvider) {
                // @ts-ignore
                onChange(cloudProvider);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default CloudProviderRadio;
