import { createContext } from "react";

export interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthReady: boolean;
  logout: () => Promise<void>;
}

export const TokenContext = createContext<AuthContextValue | undefined>(
  undefined,
);
