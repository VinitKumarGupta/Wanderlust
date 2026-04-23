import React, { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children, onFlash }) {
    const [currUser, setCurrUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // On mount, check session with backend and pick up any pending flash
    useEffect(() => {
        apiFetch("/auth/me")
            .then((data) => {
                setCurrUser(data.user || null);
                if (onFlash && data.flash) {
                    const s = data.flash.success;
                    const e = data.flash.error;
                    if (Array.isArray(s) && s.length > 0) onFlash("success", s[0]);
                    if (Array.isArray(e) && e.length > 0) onFlash("error", e[0]);
                }
            })
            .catch(() => setCurrUser(null))
            .finally(() => setAuthLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ currUser, setCurrUser, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
