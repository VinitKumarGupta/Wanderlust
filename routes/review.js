const express = require("express");
const router = express.Router({ mergeParams: true });
// We will wrap all of our asynchronous routes with wrapAsync so that any error don't lead to crashing of our server (any kind of error)!
const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    validateReview,
    isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Post Review Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
