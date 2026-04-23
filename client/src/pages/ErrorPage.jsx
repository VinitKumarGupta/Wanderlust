import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ErrorPage({ message = "Page Not Found!" }) {
    return (
        <>
            <Navbar showSearch={false} />
            <div className="container">
                <div className="error-container text-center" style={{ minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/website-error-illustration-download-in-svg-png-gif-file-formats--404-web-site-webpage-solving-miscellaneous-pack-illustrations-5230174.png"
                        alt="Error Illustration"
                        style={{ width: "300px", maxWidth: "100%" }}
                    />
                    <div className="alert alert-danger mt-3" role="alert" style={{ maxWidth: "500px", width: "100%" }}>
                        <h2 className="fw-bold">Oops! An Error Occurred</h2>
                        <p style={{ color: "red", fontWeight: 500 }}>{message}</p>
                        <Link to="/listings" className="alert-link">Go back to Listings</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
