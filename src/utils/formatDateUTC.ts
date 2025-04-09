function formatDateUTC(timestamp) {
  if (!timestamp) return "";
  const dateObject = new Date(timestamp);

  const date = dateObject.getUTCDate().toString().padStart(2, "0");
  const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = dateObject.getUTCFullYear();
  const hours = dateObject.getUTCHours().toString().padStart(2, "0");
  const minutes = dateObject.getUTCMinutes().toString().padStart(2, "0");
  const seconds = dateObject.getUTCSeconds().toString().padStart(2, "0");

  const formatted = `${year}-${month}-${date} ${hours}:${minutes}:${seconds} UTC`;

  return formatted;
}

export default formatDateUTC;
