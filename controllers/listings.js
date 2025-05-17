const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Add this to your listings controller
module.exports.index = async (req, res) => {
    const { category } = req.query; // Get ?category=beach
    let query = {};

    if (category) {
        query = { categories: category }; // Filter listings by category
    }

    const listings = await Listing.find(query);
    res.render("listings/index", {
        allListings: listings,
        showSearchBar: true,
    });
};

module.exports.newListingForm = (req, res) => {
    res.render("listings/new.ejs", { showSearchBar: false });
};

module.exports.showListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing does not exist!");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listing, showSearchBar: true });
    } catch (err) {
        req.flash("error", "Invalid listing ID!");
        res.redirect("/listings");
    }
};

module.exports.createNewListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot Edit, Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/h_200,w_350"
    );
    res.render("listings/edit.ejs", {
        listing,
        originalImageUrl,
        showSearchBar: false,
    });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Geocode the new location if it was updated
    if (req.body.listing.location) {
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        // Update the geometry field with new coordinates
        req.body.listing.geometry = response.body.features[0].geometry;
    }

    // Update the listing with the new data
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Handle image update if a new file is uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // Save the updated listing
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

// For search bar:
module.exports.searchListing = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        // If empty search, redirect back to all listings
        return res.redirect("/listings");
    }

    const regex = new RegExp(q, "i"); // case-insensitive regex search
    const listings = await Listing.find({
        $or: [{ title: regex }, { country: regex }],
    });

    res.render("listings/index", {
        allListings: listings,
        noResults: listings.length === 0,
        showSearchBar: true,
    });
};
