import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../api";
import { useFlash } from "../context/FlashContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ListingEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addFlash } = useFlash();

    const [listing, setListing] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [country, setCountry] = useState("");
    const [image, setImage] = useState(null);
    
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await apiFetch(`/listings/${id}/edit`);
                setListing(data.listing);
                setOriginalImageUrl(data.originalImageUrl);
                setTitle(data.listing.title);
                setDescription(data.listing.description);
                setPrice(data.listing.price);
                setLocation(data.listing.location);
                setCountry(data.listing.country);
            } catch (err) {
                addFlash("error", err.message || "Failed to fetch listing for edit.");
                navigate("/listings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }, [id, addFlash, navigate]);

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
            if (image) {
                formData.append("listing[image]", image);
            }

            const data = await apiFetch(`/listings/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (data.flash?.success) {
                addFlash("success", data.flash.success);
            }
            navigate(`/listings/${id}`);
        } catch (err) {
            addFlash("error", err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar showSearch={false} />
                <div className="container">
                    <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>
                </div>
                <Footer />
            </>
        );
    }

    if (!listing) return null;

    return (
        <>
            <Navbar showSearch={false} />
            <div className="container">
                <div className="row mt-4 mb-4">
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
                        <h2>Edit your listing</h2>
                        <form
                            onSubmit={handleSubmit}
                            className={`needs-validation ${validated ? "was-validated" : ""}`}
                            noValidate
                        >
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control"
                                    required
                                />
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Invalid Title.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="form-control"
                                    required
                                ></textarea>
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Invalid Description.</div>
                            </div>
                            
                            {originalImageUrl?.includes("WanderlustDev") && (
                                <>
                                    <h6>Original Listing Image</h6>
                                    <div className="mb-3">
                                        <img src={originalImageUrl} alt="Original Listing" />
                                    </div>
                                </>
                            )}
                            
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Upload New Image</label>
                                <input 
                                    type="file" 
                                    id="image"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="form-control" 
                                />
                                <div className="invalid-feedback">Invalid Image URL.</div>
                            </div>
                            
                            <div className="row">
                                <div className="mb-3 col-md-4">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <div className="valid-feedback">Looks good!</div>
                                    <div className="invalid-feedback">Invalid Price</div>
                                </div>
                                <div className="mb-3 col-md-8">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <div className="valid-feedback">Looks good!</div>
                                    <div className="invalid-feedback">Invalid location</div>
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="country" className="form-label">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="form-control"
                                    required
                                />
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Invalid country name</div>
                            </div>
                            
                            <button disabled={isSubmitting} className="btn btn-dark edit-btn mt-3 mb-4">
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
