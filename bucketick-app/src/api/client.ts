import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Base URL of the Bucketick API.
 *
 * Override per environment with EXPO_PUBLIC_API_URL. Notes for local dev:
 *  - iOS simulator: http://localhost:8090 works.
 *  - Android emulator: use http://10.0.2.2:8090.
 *  - Physical device (Expo Go): use your computer's LAN IP, e.g. http://192.168.1.20:8090.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8090';
const PREFIX = '/api/v1';

const KEYS = {
  access: 'bucketick:access_token',
  refresh: 'bucketick:refresh_token',
};

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.access);
}
export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.refresh);
}
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.access, accessToken],
    [KEYS.refresh, refreshToken],
  ]);
}
export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.access, KEYS.refresh]);
}

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  details?: unknown;
  constructor(message: string, status: number, errorCode?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function rawFetch(method: HttpMethod, path: string, body: unknown, token: string | null) {
  return fetch(`${API_URL}${PREFIX}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * The single request primitive. Adds the bearer token, unwraps the { data }
 * envelope, and transparently refreshes the access token once on a 401.
 */
export async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  skipRefresh = false
): Promise<T> {
  const token = await getAccessToken();
  let res = await rawFetch(method, path, body, token);

  if (res.status === 401 && !skipRefresh) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        const refreshed = await request<{ accessToken: string; refreshToken: string }>(
          'POST',
          '/auth/refresh',
          { refresh_token: refreshToken },
          true
        );
        await saveTokens(refreshed.accessToken, refreshed.refreshToken);
        res = await rawFetch(method, path, body, refreshed.accessToken);
      } catch {
        await clearTokens();
        throw new ApiError('Your session expired. Please log in again.', 401, 'session_expired');
      }
    }
  }

  if (!res.ok) {
    let payload: Record<string, unknown> = {};
    try {
      payload = await res.json();
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(
      (payload.message as string) || res.statusText || 'Request failed',
      res.status,
      payload.errorCode as string | undefined,
      payload.details
    );
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  return (json?.data !== undefined ? json.data : json) as T;
}
