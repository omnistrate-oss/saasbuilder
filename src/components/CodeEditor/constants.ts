import { baseSystermParameters,ResourceType } from "./systemParameters";

export type SystemVariable = {
  label: string;
  documentation: string;
  insertText: string;
  path: string[];
  type?: "string" | "integer";
};

const getSystemVariables = (resourceType: ResourceType) => {
  return Object.entries(baseSystermParameters)
    .map(([key, value]) => {
      if (value.unapplicableTo?.includes(resourceType)) {
        return null;
      }

      return {
        label: `$sys.${key}`,
        documentation: value.description,
        insertText: `"$sys.${key}"`,
        path: ["sys", ...key.split(".")],
        type: value.type,
        kind: 9, // monaco.languages.CompletionItemKind.Property,
      };
    })
    .filter(Boolean) as SystemVariable[];
};

export const composeSystemVariables = getSystemVariables("compose");
export const kustomizeSystemVariables = getSystemVariables("kustomize");
export const helmSystemVariables = getSystemVariables("helm");
export const operatorSystemVariables = getSystemVariables("operator");
