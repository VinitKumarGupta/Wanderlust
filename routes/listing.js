const express = require("express");
const router = express.Router();
// We will wrap all of our asynchronous routes with wrapAsync so that any error don't lead to crashing of our server (any kind of error)!
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index & Create Routes
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createNewListing)
    );

// New Route
router.get("/new", isLoggedIn, listingController.newListingForm);

// Search filter via search bar (written above to prevent conflict with ids)
router.get("/search", listingController.searchListing);

// Show & Update & Delete Routes
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports = router;
// "We removed '/listings' part from every route and made them common in app.js file"
