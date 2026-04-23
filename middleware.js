const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in!" });
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        return res
            .status(403)
            .json({ error: "You don't have the permission to do that." });
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const categoriesRaw = req.body.listing?.categories;

    // Normalize categories to an array
    if (typeof categoriesRaw === "string") {
        req.body.listing.categories = categoriesRaw
            .split(",")
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== "");
    } else if (Array.isArray(categoriesRaw)) {
        req.body.listing.categories = categoriesRaw
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== "");
    } else {
        req.body.listing.categories = [];
    }

    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return res.status(400).json({ error: errMsg });
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return res.status(400).json({ error: errMsg });
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        return res
            .status(403)
            .json({ error: "You don't have the permission to do that." });
    }
    next();
};
