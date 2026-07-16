import { useMemo } from "react";
import { useToken } from "../context/useToken";
import type { JwtPayload } from "../types/auth";

interface DecodedJwtPayload extends JwtPayload {
  exp?: number;
}

function getPayloadFromToken(jwt: string): DecodedJwtPayload | null {
  try {
    const encodedPayload = jwt.split(".")[1];
    if (!encodedPayload) return null;

    return JSON.parse(atob(encodedPayload)) as DecodedJwtPayload;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

export const useUser = (): JwtPayload | null => {
  const { token } = useToken();

  return useMemo((): JwtPayload | null => {
    if (!token) return null;

    const payload = getPayloadFromToken(token);
    if (!payload?.userId || !payload.email) return null;

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  }, [token]);
};
