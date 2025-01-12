import { useMemo } from "react";
import CardWithTitle from "src/components/Card/CardWithTitle";
import GridDynamicField from "src/components/DynamicForm/GridDynamicField";
import { Field } from "src/components/DynamicForm/types";
import { Text } from "src/components/Typography/Typography";
import { productTierTypes } from "src/constants/servicePlan";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { FormMode } from "src/types/common/enums";

type NetworkFieldsProps = {
  formData: any;
  formMode: FormMode;
  resourceSchema: any;
  isFetchingResourceSchema?: boolean;
};

const NetworkFields: React.FC<NetworkFieldsProps> = ({
  formData,
  formMode,
  resourceSchema,
  isFetchingResourceSchema,
}) => {
  const { serviceOfferingsObj } = useGlobalData();
  const { values } = formData;

  const fields = useMemo(() => {
    const fields: Field[] = [];
    const { serviceId, servicePlanId } = values;
    const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
    const isMultiTenancy =
      offering?.productTierType === productTierTypes.OMNISTRATE_MULTI_TENANCY;

    const inputParametersObj = (resourceSchema?.inputParameters || []).reduce(
      (acc: any, param: any) => {
        acc[param.key] = param;
        return acc;
      },
      {}
    );

    const cloudProviderFieldExists = inputParametersObj["cloud_provider"];
    const customNetworkFieldExists = inputParametersObj["custom_network_id"];

    const networkTypeFieldExists =
      cloudProviderFieldExists &&
      !isMultiTenancy &&
      offering?.supportsPublicNetwork;

    if (networkTypeFieldExists) {
      fields.push({
        label: "Network",
        subLabel: "Type of Network",
        name: "networkType",
        type: "radio",
        required: true,
        disabled: formMode !== "create",
        options: [
          { label: "Public", value: "PUBLIC" },
          { label: "Internal", value: "INTERNAL" },
        ],
        previewValue: () => (
          <Text size="small" weight="medium" color="#181D27">
            {values.networkType}
          </Text>
        ),
      });
    }

    if (customNetworkFieldExists) {
      fields.push({
        label: "Custom Network ID",
        subLabel: "Select the custom network ID",
        name: "customNetworkId",
        type: "select",
        required: true,
        disabled: formMode !== "create",
        menuItems: [],
        emptyMenuText: "No custom networks available",
        previewValue: () => (
          <Text size="small" weight="medium" color="#181D27">
            {values.customNetworkId}
          </Text>
        ),
      });
    }

    return fields;
  }, [formMode, serviceOfferingsObj, values, resourceSchema?.inputParameters]);

  if (!fields.length) {
    return null;
  }

  return (
    <CardWithTitle title="Network Configuration">
      <div className="space-y-6">
        {fields.map((field, index) => {
          return (
            <GridDynamicField key={index} field={field} formData={formData} />
          );
        })}
      </div>
    </CardWithTitle>
  );
};

export default NetworkFields;
