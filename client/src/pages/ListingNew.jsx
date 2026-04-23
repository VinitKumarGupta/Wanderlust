import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../api";
import { useFlash } from "../context/FlashContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ListingNew.css";

const ALL_CATEGORIES = [
    "pools",
    "trending",
    "farms",
    "top cities",
    "camping",
    "castles",
    "skating",
    "hotels",
    "beach",
    "igloos",
    "mountains",
    "rooms",
    "ski-in/out",
    "boats",
    "creative spaces",
    "caravans",
    "arctic",
    "nature",
    "golfing",
    "urban",
    "cabins",
    "snowboarding",
    "luxury",
    "cozy",
];

export default function ListingNew() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [country, setCountry] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [validated, setValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { addFlash } = useFlash();
    const { currUser, authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !currUser) {
            addFlash("error", "You must be logged in to create a listing!");
            navigate("/login");
        }
    }, [currUser, authLoading, navigate, addFlash]);

    const handleAddCategory = (cat) => {
        setSelectedCategories([...selectedCategories, cat]);
    };

    const handleRemoveCategory = (cat) => {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("listing[title]", title);
            formData.append("listing[description]", description);
            formData.append("listing[price]", price);
            formData.append("listing[location]", location);
            formData.append("listing[country]", country);
            formData.append(
                "listing[categories]",
                selectedCategories.join(","),
            );
            if (image) {
                formData.append("listing[image]", image);
            }

            const data = await apiFetch("/listings", {
                method: "POST",
                body: formData,
            });

            if (data.flash?.success) {
                addFlash("success", data.flash.success);
            }
            navigate(`/listings/${data.listing._id}`);
        } catch (err) {
            addFlash("error", err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !currUser) return null;

    return (
        <>
            <Navbar showSearch={false} />
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2 full-space">
                        <h2 className="mb-4">Create a new listing:</h2>
                        <form
                            onSubmit={handleSubmit}
                            className={`needs-validation ${validated ? "was-validated" : ""}`}
                            noValidate
                        >
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Add a catchy title"
                                    className="form-control"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Invalid Title.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="description"
                                    className="form-label"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="form-control"
                                    required
                                ></textarea>
                                <div className="invalid-feedback">
                                    Invalid Description.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">
                                    Upload Listing Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
                                    className="form-control"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Listing Image is Required.
                                </div>
                            </div>
                            <div className="row">
                                <div className="mb-3 col-md-4">
                                    <label
                                        htmlFor="price"
                                        className="form-label"
                                    >
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        placeholder="1200"
                                        className="form-control"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Invalid Price
                                    </div>
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label
                                        htmlFor="location"
                                        className="form-label"
                                    >
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        placeholder="Jaipur, Rajasthan"
                                        className="form-control"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Invalid location
                                    </div>
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label
                                        htmlFor="country"
                                        className="form-label"
                                    >
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        value={country}
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                        placeholder="India"
                                        className="form-control"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Invalid country name
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 col-md-12">
                                <label className="form-label mb-2">
                                    Select all categories that apply
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {ALL_CATEGORIES.map((cat) => {
                                        const isSelected =
                                            selectedCategories.includes(cat);
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                className={`btn rounded-pill ${isSelected ? "btn-danger" : "btn-outline-secondary"}`}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        handleRemoveCategory(
                                                            cat,
                                                        );
                                                    } else {
                                                        handleAddCategory(cat);
                                                    }
                                                }}
                                                style={{
                                                    textTransform: "capitalize",
                                                    padding: "0.4rem 1rem",
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="btn btn-dark add-btn mt-3 mb-5"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Listing"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
