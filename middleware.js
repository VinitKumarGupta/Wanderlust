const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
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
        req.flash("error", "You don't have the permission to do that.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const categoriesRaw = req.body.listing?.categories;

    // Normalize categories to an array
    if (typeof categoriesRaw === "string") {
        // Split and filter out empty strings after trimming
        req.body.listing.categories = categoriesRaw
            .split(",")
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== ""); // Remove empty strings
    } else if (Array.isArray(categoriesRaw)) {
        req.body.listing.categories = categoriesRaw
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== ""); // Remove empty strings
    } else {
        req.body.listing.categories = [];
    }

    // console.log("BODY BEFORE VALIDATION:", req.body);

    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return res.render("error", { message: errMsg });
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have the permission to do that.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
