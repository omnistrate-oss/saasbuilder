import Link from "next/link";
import { useMemo } from "react";
import CardWithTitle from "src/components/Card/CardWithTitle";
import GridDynamicField from "src/components/DynamicForm/GridDynamicField";
import { Field } from "src/components/DynamicForm/types";
import { FormMode } from "src/types/common/enums";

type DeploymentConfigurationFieldsProps = {
  formData: any;
  formMode: FormMode;
  resourceSchema: any;
  isFetchingResourceSchema?: boolean;
};

const DeploymentConfigurationFields: React.FC<
  DeploymentConfigurationFieldsProps
> = ({ formData, formMode, resourceSchema, isFetchingResourceSchema }) => {
  const { values } = formData;
  const fields = useMemo(() => {
    const fields: Field[] = [];
    if (!resourceSchema?.inputParameters) return fields;

    const filteredSchema = resourceSchema?.inputParameters.filter(
      (param) =>
        param.key !== "cloud_provider" &&
        param.key !== "region" &&
        param.key !== "custom_network_id" &&
        param.key !== "custom_availability_zone" &&
        param.key !== "subscriptionId"
    );

    filteredSchema.forEach((param) => {
      if (param.type === "Password") {
        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key],
          type: "password",
          required: formMode !== "modify" && param.required,
          showPasswordGenerator: true,
        });
      } else if (
        param.dependentResourceID &&
        param.key !== "cloud_provider_account_config_id"
      ) {
        const dependentResourceId = param.dependentResourceID;
        const options = resourceIdInstancesHashMap[dependentResourceId]
          ? resourceIdInstancesHashMap[dependentResourceId]
          : [];

        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key],
          type: "select",
          menuItems: options.map((option) => ({
            label: option,
            value: option,
          })),
          required: formMode !== "modify" && param.required,
          isLoading: isFetchingResourceInstanceIds,
        });
      } else if (param.type === "Boolean") {
        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key],
          type: "radio",
          options: [
            { label: "True", value: true },
            { label: "False", value: false },
          ],
          required: formMode !== "modify" && param.required,
        });
      } else if (param.options !== undefined && param.isList === true) {
        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key],
          type: "multi-select-autocomplete",
          menuItems: param.options.map((option) => ({
            label: option,
            value: option,
          })),
          required: formMode !== "modify" && param.required,
        });
      } else if (param.options !== undefined && param.isList === false) {
        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key],
          type: "single-select-autocomplete",
          menuItems: param.options.map((option) => option),
          required: formMode !== "modify" && param.required,
        });
      } else {
        if (
          param.key !== "cloud_provider_native_network_id" ||
          values.cloudProvider !== "gcp"
        ) {
          if (
            param.key === "cloud_provider_account_config_id" ||
            (param.key === "cloud_provider_native_network_id" &&
              values.cloudProvider === "gcp")
          ) {
            return;
          }

          fields.push({
            label: param.displayName || param.key,
            subLabel:
              param.key === "cloud_provider_native_network_id" ? (
                <>
                  {param.description && <br />}
                  If you&apos;d like to deploy within your VPC, enter its ID.
                  Please ensure your VPC meets the{" "}
                  <Link
                    style={{
                      textDecoration: "underline",
                      color: "blue",
                    }}
                    href="https://docs.omnistrate.com/usecases/byoa/?#bring-your-own-vpc-byo-vpc"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    prerequisites
                  </Link>
                  .
                </>
              ) : (
                param.description
              ),
            name: `requestParams.${param.key}`,
            value: values.requestParams[param.key],
            type: "text-multiline",
            required: formMode !== "modify" && param.required,
          });
        }
      }
    });

    return fields;
  }, [formMode, values, resourceSchema?.inputParameters]);

  if (!fields.length) {
    return null;
  }

  return (
    <CardWithTitle title="Deployment Configuration">
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

export default DeploymentConfigurationFields;
