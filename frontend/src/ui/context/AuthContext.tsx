// src/ui/context/AuthContext.tsx
import {
    useState,
    useEffect,
    useRef,
    createContext,
    useContext,
    useCallback,
    useMemo,
} from "react";
import {API_URL} from "../../config";

const AuthContext = createContext<any | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshIntervalRef = useRef<number | null>(null);

    const handleNotAuthenticated = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL + "/users/me", {
                method: "GET",
                credentials: "include",
                headers: {Accept: "application/json"},
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                if (json && (json.detail === "Not authenticated" || res.status === 401)) {
                    handleNotAuthenticated();
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(json);
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error("fetchCurrentUser error", err);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, [handleNotAuthenticated]);

    const refreshToken = useCallback(async () => {
        try {
            const res = await fetch(API_URL + "/auth/refresh", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                if (json && (json.detail === "Not authenticated" || res.status === 401)) {
                    handleNotAuthenticated();
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                return;
            }

            await fetchCurrentUser();
        } catch (err) {
            console.error("refreshToken error", err);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [fetchCurrentUser, handleNotAuthenticated]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (isAuthenticated) {
            refreshIntervalRef.current = window.setInterval(() => {
                refreshToken();
            }, 15 * 60 * 1000);
        } else {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [isAuthenticated, refreshToken]);

    const login = useCallback(
        async ({email, password}: { email: string; password: string }) => {
            try {
                const res = await fetch(API_URL + "/auth/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password}),
                    credentials: "include",
                });

                const json = await res.json().catch(() => null);

                if (!res.ok) {
                    const msg =
                        (json && (json.detail || json.error || json.message)) ||
                        `Ошибка: ${res.status}`;
                    return {ok: false, message: msg};
                }

                await fetchCurrentUser();
                return {ok: true};
            } catch (err: any) {
                return {ok: false, message: err?.message || "Ошибка при входе"};
            }
        },
        [fetchCurrentUser]
    );

    const register = useCallback(
        async (body: any) => {
            try {
                const res = await fetch(API_URL + "/auth/register", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify(body),
                });

                const json = await res.json().catch(() => null);

                if (!res.ok) {
                    const msg =
                        (json && (json.detail || json.error || json.message)) ||
                        `Ошибка: ${res.status}`;
                    return {ok: false, message: msg};
                }

                await fetchCurrentUser();
                return {ok: true};
            } catch (err: any) {
                return {ok: false, message: err?.message || "Ошибка при регистрации"};
            }
        },
        [fetchCurrentUser]
    );

    const logout = useCallback(async () => {
            try {
                const res = await fetch(API_URL + "/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });

                const json = await res.json()

                if (!res.ok) {
                    const msg =
                        (json && (json.detail || json.error || json.message)) ||
                        `Ошибка: ${res.status}`;
                    return {ok: false, message: msg};
                }

                await fetchCurrentUser();
                return {ok: true}

            } catch (e) {
                console.warn("logout error", e);
            }

            setUser(null);
            setIsAuthenticated(false);
        }, [fetchCurrentUser]
    );

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            refresh: fetchCurrentUser,
            setAuthenticated: setIsAuthenticated,
        }),
        [user, loading, isAuthenticated, login, register, logout, fetchCurrentUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
