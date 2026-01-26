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
                redirect: "manual",
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                handleNotAuthenticated();
            } else {
                if (json && json.email) {
                    setUser(json);
                    setIsAuthenticated(true);
                } else {
                    handleNotAuthenticated();
                }
            }
        } catch (err) {
            console.error("fetchCurrentUser error", err);
            handleNotAuthenticated();
        } finally {
            setLoading(false);
        }
    }, [handleNotAuthenticated]);

    const refreshToken = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch(API_URL + "/auth/refresh", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                redirect: "manual"
            });

            if (res.redirected) {
                console.warn('refresh redirected to', res.url);
                return false;
            }

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                if (json && (json.detail === "Not authenticated" || res.status === 401)) {
                    handleNotAuthenticated();
                }
                return false;
            }

            await fetchCurrentUser();
            return true;
        } catch (err) {
            console.error("refreshToken error", err);
            handleNotAuthenticated();
            return false;
        }
    }, [fetchCurrentUser, handleNotAuthenticated]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const refreshed = await refreshToken();
            if (!refreshed && mounted) {
                await fetchCurrentUser();
            }
        })();

        return () => {
            mounted = false;
        };
    }, [refreshToken, fetchCurrentUser]);

    useEffect(() => {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }

        refreshIntervalRef.current = window.setInterval(() => {
            refreshToken().catch(err => {
                console.warn("periodic refreshToken failed", err);
            });
        }, 1 * 60 * 1000);

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [refreshToken]);

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
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            });

            // безопасно разбираем тело
            const json = await res.json().catch(() => null);

            if (!res.ok) {
                const msg =
                    (json && (json.detail || json.error || json.message)) ||
                    `Ошибка: ${res.status}`;
                return {ok: false, message: msg};
            }

            // После логаута обновляем состояние пользователя
            await fetchCurrentUser();
            return {ok: true};
        } catch (e) {
            console.warn("logout error", e);
            // даже если возникает ошибка сети — сбросим локальное состояние
            handleNotAuthenticated();
            return {ok: false, message: "Ошибка при выходе"};
        }
    }, [fetchCurrentUser, handleNotAuthenticated]);

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
