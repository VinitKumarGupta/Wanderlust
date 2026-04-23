import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiFetch from "../api";
import { useTax } from "../context/TaxContext";

const FILTERS = [
    { iconClass: "fa-solid fa-water-ladder", label: "Pools" },
    { iconClass: "fa-solid fa-fire", label: "Trending" },
    { iconClass: "fa-solid fa-cow", label: "Farms" },
    { iconClass: "fa-solid fa-mountain-city", label: "Top Cities" },
    { iconClass: "fa-solid fa-campground", label: "Camping" },
    {
        iconClass: "fa-brands fa-fort-awesome",
        label: "Castles",
        extraStyle: { transform: "translateY(-10px)" },
    },
    { iconClass: "fa-solid fa-person-skating", label: "Skating" },
    { iconClass: "fa-solid fa-hotel", label: "Hotels" },
    { iconClass: "fa-solid fa-umbrella-beach", label: "Beach" },
    { iconClass: "fa-solid fa-igloo", label: "Igloos" },
    { iconClass: "fa-solid fa-mountain", label: "Mountains" },
    { iconClass: "fa-solid fa-bed", label: "Rooms" },
    { iconClass: "fa-solid fa-person-skiing", label: "Ski-in/out" },
    { iconClass: "fa-solid fa-sailboat", label: "Boats" },
    { iconClass: "fa-solid fa-palette", label: "Creative spaces" },
    { iconClass: "fa-solid fa-caravan", label: "Caravans" },
    { iconClass: "fa-solid fa-snowflake", label: "Arctic" },
    { iconClass: "fa-solid fa-tree", label: "Nature" },
    { iconClass: "fa-solid fa-golf-ball-tee", label: "Golfing" },
    { iconClass: "fa-solid fa-city", label: "Urban" },
    { iconClass: "fa-solid fa-house-chimney", label: "Cabins" },
    { iconClass: "fa-solid fa-person-snowboarding", label: "Snowboarding" },
    { iconClass: "fa-solid fa-wine-glass", label: "Luxury" },
    { iconClass: "fa-solid fa-mug-hot", label: "Cozy" },
];

export default function ListingsIndex() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showTax } = useTax();
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const filterRef = useRef(null);

    // Drag-to-scroll refs
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftPos = useRef(0);

    const q = searchParams.get("q");
    const category = searchParams.get("category");

    // Fetch listings whenever query params change
    useEffect(() => {
        setLoading(true);
        let url;
        if (q) {
            url = `/listings/search?q=${encodeURIComponent(q)}`;
        } else if (category) {
            url = `/listings?category=${encodeURIComponent(category)}`;
        } else {
            url = "/listings";
        }
        apiFetch(url)
            .then((data) => {
                setListings(data.listings);
                setActiveCategory(category || null);
            })
            .catch(() => setListings([]))
            .finally(() => setLoading(false));
    }, [q, category]);

    // Drag-to-scroll on filter bar (same as original script.js)
    useEffect(() => {
        const el = filterRef.current;
        if (!el) return;

        const onDown = (e) => {
            isDragging.current = true;
            el.style.cursor = "grabbing";
            startX.current = e.pageX - el.offsetLeft;
            scrollLeftPos.current = el.scrollLeft;
        };
        const onLeave = () => {
            isDragging.current = false;
            el.style.cursor = "grab";
        };
        const onUp = () => {
            isDragging.current = false;
            el.style.cursor = "grab";
        };
        const onMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX.current) * 2;
            el.scrollLeft = scrollLeftPos.current - walk;
        };

        el.addEventListener("mousedown", onDown);
        el.addEventListener("mouseleave", onLeave);
        el.addEventListener("mouseup", onUp);
        el.addEventListener("mousemove", onMove);
        return () => {
            el.removeEventListener("mousedown", onDown);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("mouseup", onUp);
            el.removeEventListener("mousemove", onMove);
        };
    }, []);

    // Navbar scroll blur effect
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector(".navbar");
            if (navbar)
                navbar.classList.toggle("scrolled", window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    const handleCategoryClick = (label) => {
        const cat = label.toLowerCase();
        if (activeCategory === cat) {
            setActiveCategory(null);
            navigate("/listings");
        } else {
            setActiveCategory(cat);
            navigate(`/listings?category=${encodeURIComponent(cat)}`);
        }
    };

    return (
        <>
            <Navbar showSearch={true} />
            <div className="container">
                {/* Filter Bar */}
                <div id="filter-wrapper">
                    <div className="filters-container">
                        <div id="filters" ref={filterRef}>
                            {FILTERS.map((f) => (
                                <div
                                    key={f.label}
                                    className={`filter${
                                        activeCategory === f.label.toLowerCase()
                                            ? " active"
                                            : ""
                                    }`}
                                    style={f.extraStyle}
                                    onClick={() => handleCategoryClick(f.label)}
                                >
                                    <i className={f.iconClass}></i>
                                    <p>{f.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Listing Cards */}
                {loading ? (
                    <p className="text-center mt-4">Loading...</p>
                ) : listings.length === 0 ? (
                    <p className="text-center text-gray-600 mt-4 mb-4">
                        No listings found. Try a different keyword!
                    </p>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-4">
                        {listings.map((listing) => (
                            <div className="col" key={listing._id}>
                                <div className="card listing-card">
                                    <Link
                                        to={`/listings/${listing._id}`}
                                        className="listing-link"
                                    >
                                        <img
                                            src={listing.image.url}
                                            className="card-img-top"
                                            alt="listing_image"
                                        />
                                        <div className="card-img-overlay"></div>
                                        <div className="card-body">
                                            <p className="card-text">
                                                <b>{listing.title}</b>
                                                <br />
                                                {showTax ? (
                                                    <span>
                                                        <b>
                                                            &#8377;{" "}
                                                            {(
                                                                listing.price *
                                                                1.18
                                                            ).toLocaleString(
                                                                "en-IN",
                                                            )}
                                                        </b>{" "}
                                                        per night
                                                        <i>&nbsp;(18% GST)</i>
                                                    </span>
                                                ) : (
                                                    <span>
                                                        <b>
                                                            &#8377;
                                                            {listing.price.toLocaleString(
                                                                "en-IN",
                                                            )}
                                                        </b>{" "}
                                                        per night
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
