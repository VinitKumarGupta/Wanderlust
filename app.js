if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
    // Workaround for local ISP blocking MongoDB SRV resolution
    require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const cors = require("cors");

const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// *============== CORS ==============* //
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
);

// *============== CORE MIDDLEWARE ==============* //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve React build in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client", "dist")));
}

// *============== DATABASE ==============* //
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

// *============== SESSION STORE ==============* //
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    collectionName: "sessions",
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE: ", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// *============== PASSPORT ==============* //
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// *============== LOCALS MIDDLEWARE ==============* //
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// *============== AUTH STATUS ENDPOINT ==============* //
// React calls this on mount to get current user + any pending flash messages
app.get("/api/auth/me", (req, res) => {
    const success = req.flash("success");
    const error = req.flash("error");
    res.json({
        user: req.user || null,
        flash: { success, error },
    });
});

// *============== API ROUTES ==============* //
app.use("/api", userRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/listings/:id/reviews", reviewsRoutes);

// *============== PRODUCTION CATCH-ALL ==============* //
// Serve React app for any non-API route in production
if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
    });
}

// *============== 404 HANDLER ==============* //
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// *============== ERROR HANDLER (JSON) ==============* //
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).json({ error: message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`The server is listening to port ${port}`);
});
