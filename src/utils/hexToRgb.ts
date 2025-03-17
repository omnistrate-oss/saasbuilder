export function hexToRgb(hex: string, returnCommaSeparatedNumbersOnly = true) {
  // Remove the leading '#' if it's present
  hex = hex.replace(/^#/, "");

  // Parse the hexadecimal string
  let r, g, b;
  if (hex.length === 3) {
    // If it's a shorthand hex code, convert to full form (e.g., "abc" -> "aabbcc")
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Standard 6-character hex code
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    return "";
  }

  if (returnCommaSeparatedNumbersOnly) {
    return `${r}, ${g}, ${b}`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}
