/**
 * Central API client for CardDemo microservices backend.
 *
 * All traffic is routed through the API Gateway (port 8080).
 * Routes:
 *   POST  /api/auth/login        → identity-service  (:8081)
 *   GET/POST /api/customers/**   → customer-service  (:8082)
 *   GET/POST /api/accounts/**    → account-service   (:8083)
 *   GET/POST /api/cards/**       → card-service      (:8084)
 *   GET/POST /api/transactions/** → transaction-service (:8085)
 *   GET/POST /api/payments/**    → payment-service   (:8086)
 *
 * In development Vite proxies /api/* → http://localhost:8080 (no CORS).
 * In production set VITE_API_BASE_URL to the deployed gateway URL.
 */

export const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

const ACCESS_TOKEN_KEY = 'carddemo_access_token';

// ── Token helpers ────────────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function setToken(access: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
}
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// ── Error type ───────────────────────────────────────────────────────────────
/**
 * Thrown by apiRequest when the backend returns a non-2xx response.
 * The new backend uses RFC 7807 ProblemDetail responses, so we read
 * `.detail` or `.message` depending on whether it's a Problem Detail
 * or a plain error body.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: string[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────
/**
 * Sends a request to the API Gateway.
 * Automatically attaches Bearer token when present.
 * Returns the response body directly — no envelope to unwrap.
 * Throws ApiError on non-2xx responses.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Try to parse response body as JSON
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // Backend uses RFC 7807 ProblemDetail: { title, detail, status, ... }
    // or plain { message, ... } for older patterns
    const message =
      body?.detail ?? body?.message ?? `Request failed with status ${response.status}`;
    const errors: string[] | undefined = body?.errors ?? undefined;
    throw new ApiError(response.status, message, errors);
  }

  return body as T;
}

// ── Paginated response helper ────────────────────────────────────────────────
/**
 * PageResponse<T> matches com.carddemo.common.web.PageResponse
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
