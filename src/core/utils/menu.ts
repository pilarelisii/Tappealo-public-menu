import type { Product } from "../types";

export function groupProductsByCategory(products: Product[]) {
  const map = new Map<string, Product[]>();

  for (const p of products) {
    const key = (p.category || "Otros").trim();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }

  // Orden simple: alfabético por categoría, y por nombre dentro
  const sections = Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([title, data]) => ({
      title,
      data: data
        .filter((x) => x.enabled)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

  return sections;
}