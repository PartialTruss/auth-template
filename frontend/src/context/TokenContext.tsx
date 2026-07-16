import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, refreshAccessToken } from "../lib/axios";
import { setAccessToken, subscribeAccessToken } from "../lib/authToken";
import { TokenContext } from "./CreateContext";

interface ContextChildren {
  children: ReactNode;
}

function getExpiryMs(token: string): number | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;
    const payload = JSON.parse(atob(encodedPayload)) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const TokenProvider = ({ children }: ContextChildren) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setToken = useCallback((nextToken: string | null) => {
    setAccessToken(nextToken || null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/api/logout");
    } catch {
      // Clear local session even if the network call fails.
    } finally {
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    return subscribeAccessToken((nextToken) => {
      setTokenState(nextToken);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      await refreshAccessToken();
      if (!cancelled) {
        setIsAuthReady(true);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    const expiresAt = getExpiryMs(token);
    if (!expiresAt) return;

    const msUntilRefresh = expiresAt - Date.now() - 60_000;

    if (msUntilRefresh <= 0) {
      void refreshAccessToken();
      return;
    }

    const timer = window.setTimeout(() => {
      void refreshAccessToken();
    }, msUntilRefresh);

    return () => {
      window.clearTimeout(timer);
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      setToken,
      isAuthReady,
      logout,
    }),
    [token, setToken, isAuthReady, logout],
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};
