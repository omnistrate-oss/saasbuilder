import * as psl from "psl";

function extractDomainFromEmail(email?: string) {
  if (!email || typeof email !== "string") {
    return null;
  }

  const parts = email.trim().toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : null;
}

function extractDomainFromUrl(url?: string) {
  if (!url || typeof url !== "string") return null;

  try {
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    const hostname = new URL(url).hostname;
    return hostname.toLowerCase();
  } catch {
    return null;
  }
}

function getMainDomain(domain?: string) {
  if (!domain) return null;

  const parsed = psl.parse(domain);
  return (parsed as psl.ParsedDomain).domain || null; // e.g., 'example.co.uk'
}

export function domainsMatch(email?: string, url?: string) {
  const emailDomain = extractDomainFromEmail(email);
  const urlDomain = extractDomainFromUrl(url);

  if (!emailDomain || !urlDomain) return false;

  // Exact domain match
  if (emailDomain === urlDomain) return true;

  // Main/root domain match (using psl)
  const emailMain = getMainDomain(emailDomain);
  const urlMain = getMainDomain(urlDomain);

  return emailMain && urlMain && emailMain === urlMain;
}
