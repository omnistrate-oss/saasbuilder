import {
  composeSystemVariables,
  helmSystemVariables,
  kustomizeSystemVariables,
  operatorSystemVariables,
  SystemVariable,
} from "./constants";
import { ungroupedSystemParameters } from "./systemParameters";

const ungroupedVariables: any = Object.entries(ungroupedSystemParameters).map(([key, value]) => ({
  label: `$sys.${key}`,
  documentation: value.description,
  insertText: `"$sys.${key}"`,
  type: value.type,
}));

export const getSuggestionsByPrefix = (word: string, resourceType): SystemVariable[] => {
  let systemVariables = composeSystemVariables;
  if (resourceType === "kustomize") {
    systemVariables = kustomizeSystemVariables;
  } else if (resourceType === "helm") {
    systemVariables = helmSystemVariables;
  } else if (resourceType === "operator") {
    systemVariables = operatorSystemVariables;
  }
  const parts = word.split(".");
  const depth = parts.length;

  // If we're just starting with '$' or '$sys', show top-level categories
  if (depth <= 2) {
    const uniqueGroups = new Set(systemVariables.map((v) => v.path[1]));
    return [
      ...ungroupedVariables,
      ...Array.from(uniqueGroups).map((group) => ({
        label: `$sys.${group}`,
        documentation: `Access ${group}-related variables`,
        insertText: `$sys.${group}`,
        path: ["sys", group],
        type: "group",
      })),
    ];
  }

  // Filter variables that match the current path
  return [
    ...ungroupedVariables,
    ...systemVariables.filter((v) => {
      const varPath = v.label.split(".");
      return varPath.slice(0, depth).join(".").startsWith(word);
    }),
  ];
};
