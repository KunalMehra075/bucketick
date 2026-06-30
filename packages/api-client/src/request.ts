/**
 * The single request primitive every domain method funnels through.
 *
 * Right now there is no backend, so domain methods call `stub()` instead of
 * `request()`. The shapes are identical, so swapping `stub(x)` -> `request(...)`
 * per method is a one-line change once a real API lands.
 */

interface ViteEnv {
  VITE_API_URL?: string;
  DEV?: boolean;
}

const env: ViteEnv =
  (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: ViteEnv }).env) || {};

export const BASE_URL: string = env.VITE_API_URL || 'http://localhost:8090';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'bucketick:access_token',
  REFRESH_TOKEN: 'bucketick:refresh_token',
  USER: 'bucketick:user',
} as const;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  details?: unknown;
  retryAfter?: number;
  constructor(message: string, init: Partial<ApiError> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = init.status ?? 0;
    this.errorCode = init.errorCode;
    this.details = init.details;
    this.retryAfter = init.retryAfter;
  }
}

function readToken(key: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string) : null;
  } catch {
    return null;
  }
}

function clearAuth() {
  if (typeof localStorage === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

/**
 * Real network call. Bearer JWT + 401 auto-refresh + `{ data }` unwrap.
 * Unused while the client is stubbed, but kept wired so the switch is trivial.
 */
export async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  skipRefresh = false,
): Promise<T> {
  const accessToken = readToken(STORAGE_KEYS.ACCESS_TOKEN);
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 && !skipRefresh) {
      const refreshToken = readToken(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const refreshed = await request<{ accessToken: string; refreshToken: string }>(
            'POST',
            '/api/v1/auth/refresh',
            { refresh_token: refreshToken },
            true,
          );
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(refreshed.accessToken));
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, JSON.stringify(refreshed.refreshToken));
          return request<T>(method, path, body, true);
        } catch {
          clearAuth();
          if (typeof window !== 'undefined') window.location.href = '/auth';
        }
      }
    }
    let payload: Record<string, unknown> = {};
    try {
      payload = await res.json();
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError((payload.message as string) || res.statusText, {
      status: res.status,
      errorCode: payload.errorCode as string,
      details: payload.details,
      retryAfter: Number(res.headers.get('Retry-After')) || undefined,
    });
  }

  const json = await res.json();
  return (json?.data !== undefined ? json.data : json) as T;
}

/**
 * Stand-in for `request()` until the backend exists. Resolves the provided mock
 * after a small delay so loading states render realistically.
 */
export async function stub<T>(data: T, label = ''): Promise<T> {
  if (typeof console !== 'undefined' && env.DEV) {
    console.debug(`[api-client stub] ${label}`);
  }
  await new Promise((r) => setTimeout(r, 180));
  return data;
}
