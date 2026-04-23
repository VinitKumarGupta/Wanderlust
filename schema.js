const Joi = require("joi");
const review = require("./models/review");

// Schema to validate 'listing' data server-side to prevent users from submitting undesired data
// via external tools like Hoppscotch, Postman, Thunder Client, etc.
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.object({
        //     url: Joi.string().allow("", null), // Allows an empty string or null for optional image URLs
        // }),
        //* Newer version of verifying the images (by chatgpt)
        image: Joi.any(), // or remove it completely from validation if you're not validating it at this stage
        categories: Joi.array()
            .items(
                Joi.string().valid(
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
                    "cozy"
                )
            )
            .default([]),
    }).required(),
});

// Schema to validate 'review' data
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
