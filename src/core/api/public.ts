export type PublicVenue = {
  id: string;
  slug: string;
  name: string;
  service_active: boolean;
  phone?: string;
  location_link?: string;
  social_link?: string;
  address_1?: string;
  address_2?: string;
  logo_url?: string | null;
  enabled: boolean;
};

export type Category = {
  id: string;
  venue_id: string;
  name: string;
  enabled: boolean;
};

export type PublicProduct = {
  id: string;
  venue_id: string;
  category_id: string;
  name: string;
  description: string;
  image_url?: string | null;
  price: number;
  quantity?: number;
  enabled: boolean;
};

export type OrderItem = {
  product_id: string | null;
  name: string;
  description: string;
  quantity: number;
};

export type CreateOrderBody = {
  // ✅ ahora lo vas a hacer opcional si querés "sin ubicacion"
  qr_location_id?: string;
  payment_method: string; // después lo tipás con 'EF' | 'MP' ...
  ref_order_id?: string;  // si backend lo genera, lo hacés opcional
  items: OrderItem[];
  total: number;
  name?: string;
  phone?: string;
  additional_comments?: string;
};

export type PublicPromotion = {
  id: string;
  venue_id: string | null;
  name: string | null;
  image_url: string | null;
  price: number;
  discount: number;
  start_date: any;
  end_date: any;
  enabled: boolean;
  items: { product_id: string; quantity: number }[];
};

export type PaymentMethod = {
  id: string;
  name: string;
  type: "MP" | "EF" | "TC" | "TD";
  enabled: boolean;
  payment_data?: {
    mp_public_key?: string;
    mp_access_token?: string;
  };
};

export type PublicQrLocation = {
  found: boolean;
  id: string;
  name: string | null;
  type?: string | null; // si después querés "en_lugar" / "envio" etc
}

const ORDER_STATUSES = ["entrante", "preparacion", "retirar", "falta-pagar", "terminadas"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

function getBaseUrl() {
  return (process.env.EXPO_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
}

async function apiGet<T>(path: string) {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${txt || res.statusText}`);
  }

  return (await res.json()) as T;
}

async function apiPost<T>(path: string, body: any) {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${txt || res.statusText}`);
  }

  return (await res.json()) as T;
}

// ✅ meta
export function getPublicMenuMeta(slug: string) {
  return apiGet<{ menu_updated_at: number | null }>(
    `/public/${encodeURIComponent(slug)}/menu/meta`
  );
}

export function getPublicVenue(slug: string) {
  return apiGet<PublicVenue>(`/public/${encodeURIComponent(slug)}/venue`);
}

export function getPublicCategories(slug: string) {
  return apiGet<Category[]>(`/public/${encodeURIComponent(slug)}/products/categories`);
}

export function getPublicProducts(slug: string, categoryId?: string) {
  const qs = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : "";
  return apiGet<PublicProduct[]>(`/public/${encodeURIComponent(slug)}/products${qs}`);
}

export async function getPublicPromotions(slug: string, onlyEnabled = true) {
  const res = await fetch(`${getBaseUrl()}/public/${slug}/promotions`);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`getPublicPromotions failed (${res.status}): ${txt}`);
  }

  const json = await res.json();

  // ✅ soporta ambos formatos: array directo o {promotions: []}
  const list = Array.isArray(json)
    ? json
    : Array.isArray(json?.promotions)
    ? json.promotions
    : [];

  const normalized = list.map((p: any) => ({
    id: String(p.id),
    name: p.name ?? "",
    price: Number(p.price ?? 0),
    discount: p.discount != null ? Number(p.discount) : undefined,
    enabled: Boolean(p.enabled),
    image_url: p.image_url ?? null,
    items: Array.isArray(p.items)
      ? p.items.map((it: any) => ({
          product_id: String(it.product_id),
          quantity: Number(it.quantity ?? 1),
        }))
      : [],
  }));

  return onlyEnabled ? normalized.filter((p: any) => p.enabled) : normalized;
}

export function getPublicFeaturedProducts(slug: string) {
  return apiGet<PublicProduct[]>(`/public/${encodeURIComponent(slug)}/products/featured`);
}

export function getPublicQrLocation(slug: string, qrlocationId: string) {
  return apiGet<PublicQrLocation>(`/public/${encodeURIComponent(slug)}/qr_locations/${encodeURIComponent(qrlocationId)}`);
}

export function createPublicOrderPost(slug: string, body: CreateOrderBody) {
  return apiPost<{ id: string; ref_order_id?: string }>(
    `/public/${encodeURIComponent(slug)}/orders`,
    body
  );
}
export type PublicOrderStatusResponse = {
  id: string;
  status: "entrante" | "preparacion" | "retirar" | "falta-pagar" | "terminadas";
  qr_location_id?: string | null;
  ref_order_id?: string | null;
}

export function getPublicOrderStatus(slug: string, id: string) {
  return apiGet<PublicOrderStatusResponse>(`/public/${encodeURIComponent(slug)}/orders/${encodeURIComponent(id)}/status`);
}

// src/core/api/public.ts
async function apiFetch<T>(path: string, init?: RequestInit) {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.error || `API ${res.status}: ${res.statusText}`);
  }

  return data as T;
}

/** ✅ Payment methods */
export async function getPublicPaymentMethods(slug: string) {
  const base = (process.env.EXPO_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
  const res = await fetch(`${base}/public/${encodeURIComponent(slug)}/payment_methods`);

  const data = await res.json().catch(() => []);
  console.log("payment_methods:", data);

  if (!res.ok) throw new Error("payment_methods failed");
  return data as PaymentMethod[];
}

export type CreateMpPreferenceBody = {
  items: { name: string; quantity: number; unit_price: number }[];
  total: number;

  ref_order_id: string;
  qr_location_id: string;

  notes?: string;
  phone_number?: string;
  customer_name?: string;

  success_url: string;
  failure_url: string;
  pending_url: string;
};

export type CreateMpPreferenceResponse = {
  order_id: string;
  preferenceId: string;
  init_point?: string;
  sandbox_init_point?: string;
};

export async function createMpPreference(
  slug: string,
  body: CreateMpPreferenceBody
): Promise<CreateMpPreferenceResponse> {
  const base = (process.env.EXPO_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
  const url = `${base}/public/${encodeURIComponent(slug)}/mp/preference?slug=${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `MP PREF ${res.status}`);

  return data as CreateMpPreferenceResponse;
}

export async function createPublicCall(slug: string, payload: { qr_location_id: string }) {
  const base = (process.env.EXPO_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
  const res = await fetch(`${base}/public/${slug}/calls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error || "Error creando llamada");
  return json as { ok: true; call_id: string };
}