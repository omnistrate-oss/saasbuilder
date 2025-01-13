"use client";

import clsx from "clsx";

import { Text } from "components/Typography/Typography";

import { colors } from "src/themeConfig";
import { cloudProviderLabels } from "src/constants/cloudProviders";

import AWSLogo from "../Icons/AWSLogo";
import GCPFullLogo from "../Icons/GCPFullLogo";

const CloudProviderCard = ({
  cloudProvider,
  isSelected,
  onClick,
  disabled,
}) => {
  return (
    <div
      className={clsx(
        "px-4 py-4 rounded-xl text-center flex flex-col justify-between items-center min-h-28",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      style={{
        outline: isSelected
          ? `2px solid ${colors.purple600}`
          : `1px solid ${colors.gray200}`,
      }}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {cloudProvider === "aws" ? <AWSLogo /> : <GCPFullLogo />}
      <Text size="small" weight="medium" color="#414651">
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
  return (
    <div className={clsx("grid gap-8", `grid-cols-${cloudProviders.length}`)}>
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
                onChange();
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default CloudProviderRadio;
