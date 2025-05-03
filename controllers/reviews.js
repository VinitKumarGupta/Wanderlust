const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    // We are using this because we don't want to delete the entire listing, we want to update listing with the new set of reviews.
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Then finally, remove the review from the reviews collection/ Review model.
    await Review.findByIdAndDelete(reviewId);
    // Check `reviews` (doc removed) & `listings` (ID removed) in mongosh.
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
};

// Mongo $pull operator: It Removes from an existing array all instances of a value or values that match a specified condition.
