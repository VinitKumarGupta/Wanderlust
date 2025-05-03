if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo"); // MongoDB Session Store
const flash = require("connect-flash");

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to Database: wanderlust");
    })
    .catch((err) => {
        console.log(err);
    });

// *============== CONFIGURE MIDDLEWARE WITH CONNECT-MONGO ==============* //
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    collectionName: "sessions", // Optional: customize collection name
    touchAfter: 24 * 3600, // Update session only after 24 hours (in seconds)
});

//? Adding store.on("error") is a good practice to log MongoDB store errors.
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE: ", err);
});

const sessionOptions = {
    store, // Now session info will be stored in Mongo store
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // For preventing cross-scripting attacks
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week expiration
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // you can check the expiry-date of the cookie in the applications -> cookie section.
    },
};

app.use(session(sessionOptions));
app.use(flash());
// *====================================================================* //

// *=============== CONFIGURE MIDDLEWARE FOR PASSPORT.JS ===============* //
// Note that these should be written after the app.use(session(...))
app.use(passport.initialize()); // Initializes passport
app.use(passport.session()); // Written after initializing passport
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// *====================================================================* //

// Middleware to make flash messages and logging feature in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//* Users Routes
app.use("/", userRoutes);

//* Listings Routes
app.use("/listings", listingsRoutes);

//* Reviews Routes
app.use("/listings/:id/reviews", reviewsRoutes);

// Standard Response when no page matches
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("The server is listening to port 8080");
});
