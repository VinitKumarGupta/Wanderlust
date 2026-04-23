import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiFetch from "../api";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";
import { useTax } from "../context/TaxContext";

const MAP_TOKEN = import.meta.env.VITE_MAP_TOKEN;

const STAR_LABELS = [
    "",
    "Terrible",
    "Not good",
    "Average",
    "Very good",
    "Amazing",
];

export default function ListingShow() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currUser } = useAuth();
    const { addFlash } = useFlash();
    const { showTax } = useTax();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [validated, setValidated] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const fetchListing = () =>
        apiFetch(`/listings/${id}`)
            .then((data) => setListing(data.listing))
            .catch(() => navigate("/listings"))
            .finally(() => setLoading(false));

    useEffect(() => {
        fetchListing();
    }, [id]);

    // Initialise Mapbox after listing loads
    useEffect(() => {
        if (!listing || !mapContainerRef.current || mapRef.current) return;
        if (!window.mapboxgl) return;

        window.mapboxgl.accessToken = MAP_TOKEN;
        const coords = listing.geometry.coordinates;

        const map = new window.mapboxgl.Map({
            container: mapContainerRef.current,
            center: coords,
            zoom: 8,
        });

        // Custom animated marker (same as original map.js)
        const wrapper = document.createElement("div");
        wrapper.className = "marker-wrapper";
        const circle = document.createElement("div");
        circle.className = "marker-circle";
        const el = document.createElement("div");
        el.className = "marker";
        const front = document.createElement("div");
        front.className = "front";
        const back = document.createElement("div");
        back.className = "back";
        el.appendChild(front);
        el.appendChild(back);
        wrapper.appendChild(circle);
        wrapper.appendChild(el);

        new window.mapboxgl.Marker(wrapper).setLngLat(coords).addTo(map);
        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [listing]);

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch(`/listings/${id}`, {
                method: "DELETE",
            });
            if (data.flash?.success) addFlash("success", data.flash.success);
            navigate("/listings");
        } catch (err) {
            addFlash("error", err.message || "Delete failed.");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!e.target.checkValidity()) {
            setValidated(true);
            return;
        }
        setSubmitting(true);
        try {
            const data = await apiFetch(`/listings/${id}/reviews`, {
                method: "POST",
                body: JSON.stringify({ review: { rating, comment } }),
            });
            if (data.flash?.success) addFlash("success", data.flash.success);
            setRating(1);
            setComment("");
            setValidated(false);
            // Refresh listing to show new review
            setLoading(true);
            await fetchListing();
        } catch (err) {
            addFlash("error", err.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const data = await apiFetch(`/listings/${id}/reviews/${reviewId}`, {
                method: "DELETE",
            });
            if (data.flash?.success) addFlash("success", data.flash.success);
            setLoading(true);
            await fetchListing();
        } catch (err) {
            addFlash("error", err.message || "Failed to delete review.");
        }
    };

    const isOwner =
        currUser &&
        listing?.owner &&
        String(currUser._id) === String(listing.owner._id);

    if (loading) {
        return (
            <>
                <Navbar showSearch={true} />
                <div className="container">
                    <p className="text-center mt-4">Loading...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!listing) return null;

    return (
        <>
            <Navbar showSearch={true} />
            <div className="container">
                <div className="row">
                    {/* Title */}
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2 mt-4 mb-3">
                        <h3>{listing.title}</h3>
                    </div>

                    {/* Listing Card */}
                    <div className="card col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2 mb-3 show-card listing-card">
                        <img
                            src={listing.image.url}
                            className="card-img-top show-img"
                            alt="listing_image"
                        />
                        <div className="card-body">
                            <p className="card-text">
                                <b>Owned by: </b>
                                {listing.owner?.username}
                            </p>
                            <p>
                                <i>{listing.description}</i>
                            </p>
                            <p>
                                <b>Price:&nbsp;</b>
                                {showTax ? (
                                    <span>
                                        &#8377;
                                        {(listing.price * 1.18).toLocaleString(
                                            "en-IN",
                                        )}{" "}
                                        <i>&nbsp;(18% GST)</i>
                                    </span>
                                ) : (
                                    <span>
                                        &#8377;
                                        {listing.price.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </p>
                            <p>
                                <b>Location:&nbsp;</b>
                                {listing.location}
                            </p>
                            <p>
                                <b>Country:&nbsp;</b>
                                {listing.country}
                            </p>
                        </div>
                    </div>

                    {/* Edit / Delete (owner only) */}
                    {isOwner && (
                        <div className="d-flex align-items-center gap-3 offset-md-1 offset-lg-2 mt-0 mb-5 edit-delete-btn">
                            <Link
                                to={`/listings/${listing._id}/edit`}
                                className="btn btn-dark edit-btn"
                            >
                                Edit Listing
                            </Link>
                            <form onSubmit={handleDelete}>
                                <button
                                    className="btn btn-danger"
                                    type="submit"
                                >
                                    Delete Listing
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2 mb-3 mt-2">
                        {/* Review Form (logged-in only) */}
                        {currUser && (
                            <>
                                <hr />
                                <h4>Leave a Review</h4>
                                <form
                                    onSubmit={handleReviewSubmit}
                                    noValidate
                                    className={`needs-validation${
                                        validated ? " was-validated" : ""
                                    }`}
                                >
                                    <div className="mt-3 mb-3">
                                        <label
                                            htmlFor="rating"
                                            className="form-label"
                                        >
                                            Rating
                                        </label>
                                        <fieldset className="starability-slot">
                                            <input
                                                type="radio"
                                                id="no-rate"
                                                className="input-no-rate"
                                                name="review[rating]"
                                                value="1"
                                                defaultChecked
                                                aria-label="No rating."
                                                onChange={() => setRating(1)}
                                            />
                                            {[1, 2, 3, 4, 5].map((v) => (
                                                <React.Fragment key={v}>
                                                    <input
                                                        type="radio"
                                                        id={`first-rate${v}`}
                                                        name="review[rating]"
                                                        value={v}
                                                        checked={rating === v}
                                                        onChange={() =>
                                                            setRating(v)
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`first-rate${v}`}
                                                        title={STAR_LABELS[v]}
                                                    >
                                                        {v} star
                                                        {v > 1 ? "s" : ""}
                                                    </label>
                                                </React.Fragment>
                                            ))}
                                        </fieldset>
                                    </div>
                                    <div className="mb-3 mt-3">
                                        <label
                                            htmlFor="comment"
                                            className="form-label"
                                        >
                                            Any Comments?
                                        </label>
                                        <textarea
                                            name="review[comment]"
                                            id="comment"
                                            rows="5"
                                            cols="30"
                                            className="form-control"
                                            required
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                        ></textarea>
                                        <div className="invalid-feedback">
                                            Please add some comments for a
                                            review
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-outline-dark mb-5"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : "Submit"}
                                    </button>
                                </form>
                                <hr />
                            </>
                        )}

                        {/* Book Now Button */}
                        <div className="mb-4 d-grid">
                            <button
                                type="button"
                                className="btn btn-danger btn-lg fw-bold"
                                style={{
                                    backgroundColor: "#fe424d",
                                    border: "none",
                                }}
                                onClick={() =>
                                    addFlash(
                                        "success",
                                        "Booking functionality coming soon!",
                                    )
                                }
                            >
                                Book Now
                            </button>
                        </div>

                        {/* All Reviews */}
                        <h4>All Reviews</h4>
                        <br />
                        {listing.reviews?.length > 0 ? (
                            <div className="row">
                                {listing.reviews.map((review) => (
                                    <div
                                        className="col-md-6 mb-3"
                                        key={review._id}
                                    >
                                        <div className="card h-100">
                                            <div className="card-body d-flex flex-column m-3">
                                                <h5 className="card-title">
                                                    <b>by: </b>@
                                                    {review.author?.username}
                                                </h5>
                                                <p
                                                    className="starability-result review-star"
                                                    data-rating={review.rating}
                                                ></p>
                                                <p className="card-text rvw-cmt flex-grow-1">
                                                    {review.comment}
                                                </p>
                                                {currUser &&
                                                    review.author &&
                                                    String(
                                                        review.author._id,
                                                    ) ===
                                                        String(
                                                            currUser._id,
                                                        ) && (
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteReview(
                                                                    review._id,
                                                                );
                                                            }}
                                                        >
                                                            <button className="btn btn-sm btn-dark">
                                                                Delete Review
                                                            </button>
                                                        </form>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                        <hr />
                    </div>

                    {/* Map */}
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2 mb-3 mt-2">
                        <h4>Where you'll be</h4>
                        <div id="map" ref={mapContainerRef}></div>
                        <p className="map-warn">
                            <i>
                                Map pin is approximate. Please refer to the
                                listing for the exact location.
                            </i>
                        </p>
                    </div>

                    <div style={{ display: "none" }}>
                        <a
                            href="https://www.flaticon.com/free-icons/airbnb"
                            title="airbnb icons"
                        >
                            Airbnb icons created by riajulislam - Flaticon
                        </a>
                        <a
                            href="https://www.flaticon.com/free-icons/homepage"
                            title="homepage icons"
                        >
                            Homepage icons created by Fathema Khanom - Flaticon
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
