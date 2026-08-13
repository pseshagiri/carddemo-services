/**
 * Auth API — identity-service routed via API Gateway
 *
 * POST /api/auth/login     → LoginResponseDto
 * POST /api/auth/register  → LoginResponseDto
 * GET  /api/auth/validate-token
 */
import { apiRequest, clearTokens, BASE_URL, setToken } from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * LoginResponseDto from identity-service:
 * { accessToken, tokenType, expiresIn, userId, username, email, roles }
 */
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

/**
 * Login — public endpoint, no Bearer token needed.
 * Stores the returned access token automatically.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.detail ?? body?.message ?? 'Invalid username or password.';
    throw new Error(message);
  }
  const auth: AuthResponse = body as AuthResponse;
  setToken(auth.accessToken);
  return auth;
}

/**
 * Register a new user.
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.detail ?? body?.message ?? 'Registration failed.';
    throw new Error(message);
  }
  const auth: AuthResponse = body as AuthResponse;
  setToken(auth.accessToken);
  return auth;
}

/**
 * Logout — clears local token (identity-service has no logout endpoint).
 */
export function logout(): void {
  clearTokens();
}

/**
 * Validate the current access token against the identity-service.
 */
export function validateToken(): Promise<boolean> {
  return apiRequest<boolean>('/api/auth/validate-token');
}
