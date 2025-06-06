/**
 * Extracts a specified query parameter from a URL
 * @param url The URL containing the query parameters
 * @param paramName The name of the query parameter to extract
 * @returns The value of the specified parameter or null if not found
 */
function extractQueryParam(url: string, paramName: string): string | null {
  if (!url || !paramName) {
    return null;
  }
  try {
    // Create a URL object to parse the URL
    const urlObj = new URL(url);

    // Get the specified parameter using URLSearchParams
    const paramValue = urlObj.searchParams.get(paramName);

    return paramValue;
  } catch (error) {
    console.error(`Error parsing URL or extracting parameter '${paramName}':`, error);
    return null;
  }
}

export default extractQueryParam;
