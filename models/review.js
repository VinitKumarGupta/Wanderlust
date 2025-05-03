const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Review is a kind of one-to-many relationship and not one-to-few or one-to-millions
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true, // Ensures unnecessary spaces are removed
        maxlength: 500, // Prevents excessively long reviews
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);
// Note that we will implement the review for each listing in it's respective show.ejs pages
