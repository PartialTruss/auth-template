import { useEffect, useMemo } from "react";
import { useToken } from "../context/useToken";
import type { JwtPayload } from "../types/auth";

function getPayloadFromToken(jwt: string): JwtPayload | null {
    try {
        const encodedPayload = jwt.split(".")[1];
        if (!encodedPayload) return null;

        return JSON.parse(atob(encodedPayload)) as JwtPayload;
    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
}

export const useUser = (): JwtPayload | null => {
    const [token, setToken] = useToken();

    const user = useMemo((): JwtPayload | null => {
        if (!token) return null;
        return getPayloadFromToken(token);
    }, [token]);

    useEffect(() => {
        if (token && user === null) {
            setToken("");
        }
    }, [token, user, setToken]);

    return user;
};
