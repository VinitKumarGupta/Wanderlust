import React, { useEffect } from "react";
import { useFlash } from "../context/FlashContext";

export default function FlashMessage() {
    const { messages } = useFlash();

    return (
        <>
            {messages.map((msg) => (
                <FlashItem key={msg.id} msg={msg} />
            ))}
        </>
    );
}

function FlashItem({ msg }) {
    const { removeFlash } = useFlash();

    useEffect(() => {
        // Auto-remove after 3 seconds (same as original script.js)
        const timer = setTimeout(() => {
            removeFlash(msg.id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [msg.id, removeFlash]);

    return (
        <div className={`flash-message flash-${msg.type}`}>
            {msg.text}
            <button
                className="flash-close"
                onClick={() => removeFlash(msg.id)}
            >
                &times;
            </button>
        </div>
    );
}
