export function getSlugFromHostname(hostname: string): string | null {
  // subdominio.tappealo.com -> subdominio
  const parts = hostname.split(".");
  if (parts.length < 3) return null; // tappealo.com / localhost / ip
  return parts[0] || null;
}