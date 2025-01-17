import { difference } from "lodash";

type LocalStorageRegionColorHash = undefined | string;

const colors = [
  "#7F56D9",
  "#56A294",
  "#D67B51",
  "#977D2A",
  "#003049",
  "#19A1CB",
  "#B44667",
  "#5C39A1",
  "#283618",
  "#99582A",
  "#D62828",
  "#495057",
  "#ffb703",
  "#9D8189",
  "#6F1D1B",
  "#8CB369",
  "#231942",
  "#565264",
  "#582f0e",
  "#ffcfd2",
];

export function getRegionHexColor(
  cloudProvider: string,
  region: string,
  inUseProviderRegionsList: string[]
) {
  let resultColor = "";
  let regionColorHash: Record<string, string> = {};

  if (region && cloudProvider && inUseProviderRegionsList.length > 0) {
    const key = `${cloudProvider}-${region}`;

    const regionColorHashString = localStorage.getItem(
      "regionColorHash"
    ) as LocalStorageRegionColorHash;
    try {
      if (
        regionColorHashString &&
        typeof JSON.parse(regionColorHashString) === "object"
      ) {
        regionColorHash = JSON.parse(regionColorHashString);

        const usedColors = Object.values(regionColorHash);
        const availableColors = difference(colors, usedColors);

        //check if a color been assigned already, if so get the color from localstorage and use it

        if (key in regionColorHash) {
          resultColor = regionColorHash[key];
        } else {
          // choose a color from the list of available colors
          if (availableColors.length > 0) {
            resultColor = availableColors[0];
          } else {
            //if not color is available, check if there is some region from which color can be unassigned. Unassign and use the first available color
            const setProviderRegionList = Object.keys(regionColorHash);
            const unusedProviderRegions = setProviderRegionList.filter(
              (providerRegion) => {
                const match = inUseProviderRegionsList.find(
                  (inUseProviderRegion) =>
                    providerRegion === inUseProviderRegion
                );

                return !Boolean(match);
              }
            );
            if (unusedProviderRegions.length > 0) {
              resultColor = regionColorHash[unusedProviderRegions[0]];

              unusedProviderRegions.forEach((providerRegion) => {
                delete regionColorHash[providerRegion];
              });
            } else {
              //todo handle if no available colors
            }
          }
        }
      } else {
        //region color hash has not been set
        //set first color as the result color
        resultColor = colors[0];
      }
    } catch (error) {
      console.error(error);
    }
    //update regionColorHash hash on the browser
    if (resultColor) {
      regionColorHash[key] = resultColor;
    }

    localStorage.setItem("regionColorHash", JSON.stringify(regionColorHash));
  }
  return resultColor;
}
