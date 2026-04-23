import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";
import apiFetch from "../api";

export default function Navbar({ showSearch = true }) {
    const { currUser, setCurrUser } = useAuth();
    const { addFlash } = useFlash();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);

    // Typewriter animation on search placeholder (same as original script.js)
    useEffect(() => {
        if (!showSearch || !inputRef.current) return;
        const text = "Where to next?";
        let i = 0;
        inputRef.current.setAttribute("placeholder", "");
        const interval = setInterval(() => {
            if (i <= text.length) {
                inputRef.current &&
                    inputRef.current.setAttribute(
                        "placeholder",
                        text.substring(0, i++)
                    );
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [showSearch]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch("/logout");
            setCurrUser(null);
            if (data.flash?.success) addFlash("success", data.flash.success);
            navigate("/listings");
        } catch {
            addFlash("error", "Logout failed.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) navigate(`/listings/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
            <div className="container-fluid">
                {/* Branding */}
                <div className="branding">
                    <Link className="navbar-brand" to="/listings">
                        <i className="fa-brands fa-airbnb"></i>
                        <span className="brand-name">Wanderlust</span>
                    </Link>
                </div>

                {/* Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible content */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarNavAltMarkup"
                >
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/listings">
                            Explore
                        </Link>
                    </div>

                    {showSearch && (
                        <div className="navbar-nav ms-auto">
                            <form
                                className="custom-search-form"
                                role="search"
                                onSubmit={handleSearch}
                            >
                                <div className="search-container">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="custom-search-input"
                                        id="animatedInput"
                                        aria-label="Search"
                                        name="q"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="custom-search-button"
                                    >
                                        <span className="btn-text">Search</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link" to="/listings/new">
                            List your home
                        </Link>
                        {!currUser ? (
                            <>
                                <Link className="nav-link" to="/signup">
                                    <strong>Signup</strong>
                                </Link>
                                <Link className="nav-link" to="/login">
                                    <strong>Login</strong>
                                </Link>
                            </>
                        ) : (
                            <a
                                className="nav-link"
                                href="#"
                                onClick={handleLogout}
                            >
                                Logout
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
