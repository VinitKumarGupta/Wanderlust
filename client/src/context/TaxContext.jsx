import React, { createContext, useContext, useState } from "react";

const TaxContext = createContext(null);

export function TaxProvider({ children }) {
    const [showTax, setShowTax] = useState(false);

    return (
        <TaxContext.Provider value={{ showTax, setShowTax }}>
            {children}
            {/* Global Tax Toggle */}
            <div className="tax-toggle-floating">
                <div className="form-check-reverse form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        checked={showTax}
                        onChange={() => setShowTax(!showTax)}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault"
                    >
                        Incl. taxes
                    </label>
                </div>
            </div>
        </TaxContext.Provider>
    );
}

export function useTax() {
    return useContext(TaxContext);
}
