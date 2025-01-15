import { CloudProvider } from "src/types/common/enums";

const AWS_REGION_COORDINATES = {
  "us-east-1": {
    name: "US East (N. Virginia)",
    latitude: 38.13,
    longitude: -78.45,
  },
  "us-east-2": { name: "US East (Ohio)", latitude: 39.96, longitude: -83 },
  "us-west-1": {
    name: "US West (N. California)",
    latitude: 37.35,
    longitude: -121.96,
  },
  "us-west-2": {
    name: "US West (Oregon)",
    latitude: 46.15,
    longitude: -123.88,
  },
  "af-south-1": {
    name: "Africa (Cape Town)",
    latitude: -33.9221,
    longitude: 18.4231,
  },
  "ap-east-1": {
    name: "Asia Pacific (Hong Kong)",
    latitude: 22.3193,
    longitude: 114.1694,
  },
  "ap-south-2": {
    name: "Asia Pacific (Hyderabad)",
    latitude: 17.4065,
    longitude: 78.4772,
  },
  "ap-southeast-3": {
    name: "Asia Pacific (Jakarta)",
    latitude: -6.1944,
    longitude: 106.8229,
  },
  "ap-southeast-5": {
    name: "Asia Pacific (Malaysia)",
    latitude: 4.2105,
    longitude: 101.9758,
  },
  "ap-southeast-4": {
    name: "Asia Pacific (Melbourne)",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  "ap-south-1": {
    name: "Asia Pacific (Mumbai)",
    latitude: 19.08,
    longitude: 72.88,
  },
  "ap-northeast-3": {
    name: "Asia Pacific (Osaka)",
    latitude: 34.6937,
    longitude: 135.5023,
  },
  "ap-northeast-2": {
    name: "Asia Pacific (Seoul)",
    latitude: 37.56,
    longitude: 126.98,
  },
  "ap-southeast-1": {
    name: "Asia Pacific (Singapore)",
    latitude: 1.37,
    longitude: 103.8,
  },
  "ap-southeast-2": {
    name: "Asia Pacific (Sydney)",
    latitude: 33.8,
    longitude: 151.2,
  },
  "ap-northeast-1": {
    name: "Asia Pacific (Tokyo)",
    latitude: 35.41,
    longitude: 139.42,
  },
  "ca-central-1": {
    name: "Canada (Central)",
    latitude: 45.5,
    longitude: -73.6,
  },
  "ca-west-1": {
    name: "Canada West (Calgary)",
    latitude: 51.0447,
    longitude: 114.0719,
  },

  "eu-central-1": {
    name: "Europe (Frankfurt)",
    latitude: 50.0,
    longitude: 8.0,
  },
  "eu-west-1": {
    name: "Europe (Ireland)",
    latitude: 53.7798,
    longitude: -7.3055,
  },
  "eu-west-2": {
    name: "Europe (London)",
    latitude: 51.5072,
    longitude: -0.1276,
  },
  "eu-south-1": {
    name: "Europe (Milan)",
    latitude: 45.4685,
    longitude: 9.1824,
  },
  "eu-west-3": {
    name: "Europe (Paris)",
    latitude: 48.86,
    longitude: 2.35,
  },
  "eu-south-2": {
    name: "Europe (Spain)",
    latitude: 40.4637,
    longitude: -3.7492,
  },
  "eu-north-1": {
    name: "Europe (Stockholm)",
    latitude: 59.3293,
    longitude: 18.0686,
  },
  "eu-central-2": {
    name: "Europe (Zurich)",
    latitude: 47.3769,
    longitude: 8.5417,
  },
  "il-central-1": {
    name: "Israel (Tel Aviv)",
    latitude: 32.0853,
    longitude: 34.7818,
  },
  "me-south-1": {
    name: "Middle East (Bahrain)",
    latitude: 26.0667,
    longitude: 50.5577,
  },
  "me-central-1": {
    name: "Middle East (UAE)",
    latitude: 23.4241,
    longitude: 53.8478,
  },
  "sa-east-1": {
    name: "South America (São Paulo)",
    latitude: -23.5558,
    longitude: -46.6396,
  },
  // "cn-north-1": { name: "China (Beijing)", latitude: "", longitude: "" },
  // "cn-northwest-1": { name: "China (Ningxia)", latitude: "", longitude: "" },
};

export const GCP_REGION_COORDINATES = {
  "africa-south1": {
    name: "Johannesburg, South Africa",
    latitude: -26.2041,
    longitude: 28.0473,
  },
  "asia-east1": {
    name: "Changhua County, Taiwan, APAC",
    latitude: 23.6978,
    longitude: 120.9605,
  },
  "asia-east2": {
    name: "Hong Kong, APAC",
    latitude: 22.3193,
    longitude: 114.1694,
  },
  "asia-northeast1": {
    name: "Tokyo, Japan, APAC",
    latitude: 35.6895,
    longitude: 139.6917,
  },
  "asia-northeast2": {
    name: "Osaka, Japan, APAC",
    latitude: 34.6937,
    longitude: 135.5023,
  },
  "asia-northeast3": {
    name: "Seoul, South Korea, APAC",
    latitude: 37.5665,
    longitude: 126.978,
  },
  "asia-south1": {
    name: "Mumbai, India, APAC",
    latitude: 19.08,
    longitude: 72.88,
  },
  "asia-south2": {
    name: "Delhi, India, APAC",
    latitude: 28.6139,
    longitude: 77.209,
  },
  "asia-southeast1": {
    name: "Jurong West, Singapore, APAC",
    latitude: 1.3521,
    longitude: 103.8198,
  },
  "asia-southeast2": {
    name: "Jakarta, Indonesia, APAC",
    latitude: -6.2088,
    longitude: 106.8456,
  },
  "australia-southeast1": {
    name: "Sydney, Australia, APAC",
    latitude: -33.8688,
    longitude: 151.2093,
  },
  "australia-southeast2": {
    name: "Melbourne, Australia, APAC",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  "europe-central2": {
    name: "Warsaw, Poland, Europe",
    latitude: 52.2297,
    longitude: 21.0122,
  },
  "europe-north1": {
    name: "Hamina, Finland, Europe",
    latitude: 60.5693,
    longitude: 27.1878,
  },
  "europe-southwest1": {
    name: "Madrid, Spain, Europe",
    latitude: 40.4168,
    longitude: -3.7038,
  },
  "europe-west1": {
    name: "EU (Belgium)",
    latitude: 50.5039,
    longitude: 4.4699,
  },
  "europe-west10": {
    name: "Berlin, Germany, Europe",
    latitude: 48.2082,
    longitude: 16.3738,
  },
  "europe-west12": {
    name: "Turin, Italy, Europe",
    latitude: 45.0703,
    longitude: 7.6869,
  },
  "europe-west2": {
    name: "London, England, Europe",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  "europe-west3": {
    name: "Frankfurt, Germany, Europe",
    latitude: 50.1109,
    longitude: 8.6821,
  },
  "europe-west4": {
    name: "Eemshaven, Netherlands, Europe",
    latitude: 52.1326,
    longitude: 5.2913,
  },
  "europe-west6": {
    name: "Zurich, Switzerland, Europe",
    latitude: 47.3769,
    longitude: 8.5417,
  },
  "europe-west8": {
    name: "Milan, Italy, Europe",
    latitude: 45.4642,
    longitude: 9.19,
  },
  "europe-west9": {
    name: "Paris, France, Europe",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  "me-central1": {
    name: "Doha, Qatar, Middle East",
    latitude: 25.276987,
    longitude: 51.521801,
  },
  "me-central2": {
    name: "Dammam, Saudi Arabia, Middle East",
    latitude: 25.2048,
    longitude: 55.2708,
  },
  "me-west1": {
    name: "Tel Aviv, Israel, Middle East",
    latitude: 32.0853,
    longitude: 34.7818,
  },
  "northamerica-northeast1": {
    name: "Montréal, Québec, North America",
    latitude: 45.5017,
    longitude: -73.5673,
  },
  "northamerica-northeast2": {
    name: "Toronto, Ontario, North America",
    latitude: 43.6532,
    longitude: -79.3832,
  },
  "southamerica-east1": {
    name: "Osasco, São Paulo, Brazil, South America",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  "southamerica-west1": {
    name: "Santiago, Chile, South America",
    latitude: -33.4489,
    longitude: -70.6693,
  },
  "us-central1": {
    name: "Council Bluffs, Iowa, North America",
    latitude: 42.032974,
    longitude: -93.581543,
  },
  "us-east1": {
    name: "Moncks Corner, South Carolina, North America",
    latitude: 33.8361,
    longitude: -81.1637,
  },
  "us-east4": {
    name: "Ashburn, Virginia, North America",
    latitude: 38.0336,
    longitude: -79.4583,
  },
  "us-east5": {
    name: "	Columbus, Ohio, North America",
    latitude: 39.9612,
    longitude: -82.9988,
  },
  "us-south1": {
    name: "Dallas, Texas, North America",
    latitude: 32.7767,
    longitude: -96.797,
  },
  "us-west1": {
    name: "The Dalles, Oregon, North America",
    latitude: 45.5231,
    longitude: -122.6765,
  },
  "us-west2": {
    name: "Los Angeles, California, North America",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  "us-west3": {
    name: "Salt Lake City, Utah, North America",
    latitude: 40.7608,
    longitude: -111.891,
  },
  "us-west4": {
    name: "Las Vegas, Nevada, North America",
    latitude: 36.1699,
    longitude: -115.1398,
  },
};

export function getRegionCoordinates(
  cloudProvider: CloudProvider,
  region: string
): {
  name: string;
  latitude: number;
  longitude: number;
} {
  let regionData;
  if (cloudProvider === "aws") {
    regionData = AWS_REGION_COORDINATES[region];
  } else if (cloudProvider === "gcp") {
    regionData = GCP_REGION_COORDINATES[region];
  }

  return regionData;
}
