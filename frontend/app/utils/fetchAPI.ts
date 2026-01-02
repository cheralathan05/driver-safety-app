import { BACKEND_URL } from "@/config/env";


type FetchAPIOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
};

/**
 * Centralized Fetch Helper
 * - Native fetch only (NO axios)
 * - Sends httpOnly cookies (JWT)
 * - Safe JSON parsing
 * - Normalized error handling
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchAPIOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    cache = "no-store",
  } = options;

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    credentials: "include", // 🔐 REQUIRED for cookie auth
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    // No JSON body
  }

  if (!response.ok) {
    const message =
      data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export default fetchAPI;
