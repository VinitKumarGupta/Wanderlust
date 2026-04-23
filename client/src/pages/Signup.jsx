import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiFetch from "../api";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { setCurrUser } = useAuth();
    const { addFlash } = useFlash();

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setIsLoading(true);
        try {
            const data = await apiFetch("/signup", {
                method: "POST",
                body: JSON.stringify({ username, email, password }),
            });
            localStorage.setItem('auth_token', data.token);

            setCurrUser(data.user);
            if (data.flash?.success) {
                addFlash("success", data.flash.success);
            }
            
            navigate("/listings");
        } catch (err) {
            console.error("Signup error:", err);
            addFlash("error", err.message || "Failed to create account.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar showSearch={false} />
            <div className="container">
                <div className="row mt-4 mb-5">
                    <h1 className="col-11 col-sm-8 col-md-6 offset-sm-2 offset-md-3 mb-3">SignUp on Wanderlust</h1>
                    <div className="col-11 col-sm-8 col-md-6 offset-sm-2 offset-md-3">
                        <form 
                            onSubmit={handleSubmit} 
                            className={`needs-validation ${validated ? "was-validated" : ""}`} 
                            noValidate
                        >
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="form-control"
                                    required
                                />
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Please enter a valid username.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    required
                                />
                                <div className="invalid-feedback">Please enter a valid email address.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                        required
                                        style={{ paddingRight: "2.5rem" }}
                                    />
                                    <i 
                                        className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} position-absolute`} 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ 
                                            right: "15px", 
                                            top: "50%", 
                                            transform: "translateY(-50%)", 
                                            cursor: "pointer", 
                                            color: "#6c757d", 
                                            fontSize: "1.1rem", 
                                            zIndex: 10 
                                        }}
                                    ></i>
                                    <div className="invalid-feedback">Please enter a password.</div>
                                </div>
                            </div>
                            <p>
                                Already have an account?
                                <Link to="/login" style={{ textDecoration: "none", color: "#fe424d", marginLeft: "5px" }}>Login</Link>
                            </p>
                            <button disabled={isLoading} className="btn btn-success">
                                {isLoading ? "Signing Up..." : "SignUp"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
