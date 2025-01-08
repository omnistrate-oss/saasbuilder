"use client";

import clsx from "clsx";
import { Text } from "components/Typography/Typography";
import { cloudProviderLabels } from "src/constants/cloudProviders";

const CloudProviderCard = ({ cloudProvider, isSelected, onClick }) => {
  return (
    <div
      className={clsx(
        "px-4 py-4 rounded-xl cursor-pointer text-center",
        isSelected ? "border-2 border-[#0E5FB5]" : "border border-[#E9EAEB]"
      )}
      onClick={onClick}
    >
      <Text size="small" weight="medium" color="#414651">
        {cloudProviderLabels[cloudProvider]}
      </Text>
    </div>
  );
};

const CloudProviderRadio = ({ cloudProviders, formData, name, onChange }) => {
  return (
    <div className={clsx("grid gap-8", `grid-cols-${cloudProviders.length}`)}>
      {cloudProviders.map((cloudProvider, index) => {
        return (
          <CloudProviderCard
            key={index}
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
