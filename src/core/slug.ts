export function resolveSlug(): string | null {
  // Web: subdominio hilda.tappealo.com
  if (typeof window !== "undefined") {
    const host = window.location.hostname; // hilda.tappealo.com
    const parts = host.split(".");
    const subdomain = parts.length >= 3 ? parts[0] : null;

    // Si estás en localhost o en tappealo.com directo, usa query param
    const isLocal = host.includes("localhost") || host.startsWith("127.");
    const isRootDomain = host === "tappealo.com" || host.endsWith(".tappealo.com") === false;

    const params = new URLSearchParams(window.location.search);
    const slugQuery = params.get("slug") || params.get("venue");

    if (isLocal || isRootDomain) return slugQuery;

    // En prod, subdominio manda (si existe)
    return subdomain ?? slugQuery;
  }

  // Mobile futuro: usar param en ruta o query (cuando toque)
  return null;
}