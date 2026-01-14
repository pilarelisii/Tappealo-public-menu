type HttpMethod = "GET" | "POST";

export class HttpError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(body?.error || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

if (!API_BASE) {
  console.warn("EXPO_PUBLIC_API_BASE is not set");
}

export async function http<T>(
  path: string,
  opts?: { method?: HttpMethod; body?: any }
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: opts?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) throw new HttpError(res.status, data);
  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}