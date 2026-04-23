import React from "react";

export default function Footer() {
    return (
        <footer>
            <div className="f-info">
                <div className="upper-nav">
                    <div className="nav-links">
                        <h6>
                            <strong>Support</strong>
                        </h6>
                        <a href="#">Help Center</a>
                        <a href="#">AirCover</a>
                        <a href="#">Anti-discrimination</a>
                        <a href="#">Disability support</a>
                        <a href="#">Cancellation options</a>
                        <a href="#">Report neighbourhood concern</a>
                    </div>
                    <div className="nav-links">
                        <h6>
                            <strong>Hosting</strong>
                        </h6>
                        <a href="#">List your home</a>
                        <a href="#">Aircover for Hosts</a>
                        <a href="#">Hosting resources</a>
                        <a href="#">Community forum</a>
                        <a href="#">Hosting responsibly</a>
                        <a href="#">Join a free Hosting class</a>
                        <a href="#">Find a co-host</a>
                    </div>
                    <div className="nav-links">
                        <h6>
                            <strong>Wanderlust</strong>
                        </h6>
                        <a href="#">Newsroom</a>
                        <a href="#">New features</a>
                        <a href="#">Careers</a>
                        <a href="#">Investors</a>
                        <a href="#">Wanderlust.org emergency stays</a>
                    </div>
                </div>
                <div className="lower-nav">
                    <div className="f-info-links">
                        <span className="f-info-brand">
                            &copy; 2026 Wanderlust, Inc.
                        </span>
                        <span>
                            <a href="#">Privacy</a>
                        </span>
                        <span>
                            <a href="#">Terms</a>
                        </span>
                        <span>
                            <a href="#">Sitemap</a>
                        </span>
                        <span>
                            <a href="#">Company details</a>
                        </span>
                    </div>
                    <div className="f-info-socials">
                        <span className="lang">
                            <div className="lang-icon">
                                <i className="fa-solid fa-earth-americas"></i>
                            </div>
                            <div className="lang-text">
                                <strong>English(IN)</strong>
                            </div>
                        </span>
                        <span>
                            <b>
                                <i className="fa-brands fa-facebook"></i>
                            </b>
                        </span>
                        <span>
                            <b>
                                <i className="fa-brands fa-x-twitter"></i>
                            </b>
                        </span>
                        <span>
                            <b>
                                <i className="fa-brands fa-instagram"></i>
                            </b>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
