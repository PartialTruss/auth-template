import { useState, type ReactNode } from "react";
import { TokenContext } from "./CreateContext";

interface ContextChildren {
  children: ReactNode;
}

export const TokenProvider = ({ children }: ContextChildren) => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  );
};
