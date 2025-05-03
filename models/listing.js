const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        image: {
            filename: {
                type: String,
                required: true, // Ensure that a filename is always provided
            },
            url: {
                type: String,
                required: true, // Ensure an image URL is always present
            },
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price must be a positive number"],
        },
        location: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: function () {
                return !!this.location; // !! Converts location (truthy or falsy) into true/false
                // Added this function to make country required if location is specified (to ensure geographical completeness)
            },
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        categories: {
            type: [String],
            enum: [
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
            ],
        },
    },
    { timestamps: true }
    //Including timestamps makes 'CreatedAt', 'UpdatedAt' features automatically available.
);

listingSchema.post("findOneAndDelete", async (listing) => {
    // console.log(listing.reviews);
    await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
