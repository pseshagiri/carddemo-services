import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authApi';
import { getAccessToken, clearTokens } from '../api/apiClient';

export type UserRole = 'A' | 'U';

export interface AuthUser {
  userId: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Maps identity-service role strings to frontend UserRole.
 * Roles from the backend may be bare strings like "ADMIN" or "USER".
 */
function mapRole(roles: string[]): UserRole {
  return roles.some((r) => r === 'ROLE_ADMIN' || r === 'ADMIN') ? 'A' : 'U';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Re-hydrate user from localStorage on page reload.
  useEffect(() => {
    const stored = localStorage.getItem('carddemo_user');
    if (stored && getAccessToken()) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore malformed JSON
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,

      login: async (userId: string, password: string) => {
        try {
          // identity-service returns: { accessToken, userId, username, email, roles, ... }
          const auth = await apiLogin({ username: userId, password });

          // Build first/last name from email or username (identity-service has no full_name)
          const nameParts = (auth.username ?? '').split('.');
          const firstName = nameParts[0]
            ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
            : auth.username;
          const lastName = nameParts[1]
            ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
            : '';

          const role = mapRole(auth.roles ? Array.from(auth.roles) : []);
          const authUser: AuthUser = {
            userId: auth.username,
            firstName,
            lastName,
            role,
          };
          setUser(authUser);
          localStorage.setItem('carddemo_user', JSON.stringify(authUser));
          return { success: true };
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed.';
          return { success: false, message };
        }
      },

      logout: () => {
        apiLogout();
        clearTokens();
        localStorage.removeItem('carddemo_user');
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
