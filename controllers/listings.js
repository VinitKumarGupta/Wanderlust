const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category } = req.query;

    // --- DEBUGGING LOGS --- //
    console.log("1. Filter Clicked! Category received:", category);

    let query = {};
    if (category) {
        query = { categories: { $in: [category.toLowerCase()] } };
        console.log("2. Constructed DB Query:", JSON.stringify(query));
    }

    const listings = await Listing.find(query);
    console.log(`3. DB returned ${listings.length} listings!`);
    // ---------------------- //

    res.json({ listings });
};

module.exports.showListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            return res.status(404).json({ error: "Listing does not exist!" });
        }

        res.json({ listing });
    } catch (err) {
        res.status(400).json({ error: "Invalid listing ID!" });
    }
};

module.exports.createNewListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    if (!response.body.features.length) {
        return res.status(400).json({
            error: "Invalid location entered. Please provide a valid address.",
        });
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    res.json({
        success: true,
        listing: newListing,
        flash: { success: "Successfully created a new listing!" },
    });
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res
            .status(404)
            .json({ error: "Cannot Edit, Listing does not exist!" });
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/h_200,w_350",
    );
    res.json({ listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.body.listing.location) {
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        if (response.body.features.length > 0) {
            listing.geometry = response.body.features[0].geometry;
        }
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    res.json({
        success: true,
        flash: { success: "Listing updated successfully!" },
    });
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({
        success: true,
        flash: { success: "Listing deleted successfully!" },
    });
};

module.exports.searchListing = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        const listings = await Listing.find({});
        return res.json({ listings });
    }

    const regex = new RegExp(q, "i");
    const listings = await Listing.find({
        $or: [{ title: regex }, { country: regex }],
    });

    res.json({ listings });
};
