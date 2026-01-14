const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

if (!API_BASE) {
  // Esto te avisa rápido si te olvidaste el .env
  // (en runtime web lo vas a ver en consola)
  console.warn("Missing EXPO_PUBLIC_API_BASE in .env");
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${path} ${text}`);
  }
  return (await res.json()) as T;
}