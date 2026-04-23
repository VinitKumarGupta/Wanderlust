import React, { createContext, useContext, useState, useCallback } from "react";

const FlashContext = createContext(null);

export function FlashProvider({ children }) {
    const [messages, setMessages] = useState([]);

    const addFlash = useCallback((type, text) => {
        if (!text) return;
        const id = Date.now() + Math.random();
        setMessages((prev) => [...prev, { id, type, text }]);
    }, []);

    const removeFlash = useCallback((id) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
    }, []);

    return (
        <FlashContext.Provider value={{ messages, addFlash, removeFlash }}>
            {children}
        </FlashContext.Provider>
    );
}

export function useFlash() {
    return useContext(FlashContext);
}
