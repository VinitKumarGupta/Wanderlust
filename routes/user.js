const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// Signup
router.post("/signup", wrapAsync(userController.signup));

// Login — use custom callback to return JSON instead of redirecting on failure
router.post("/login", saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            const message =
                (info && info.message) || "Invalid username or password.";
            return res
                .status(401)
                .json({ error: message, flash: { error: message } });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({
                success: true,
                user,
                flash: { success: "Welcome to Wanderlust! You're logged in!" },
            });
        });
    })(req, res, next);
});

// Logout
router.get("/logout", userController.logout);

module.exports = router;
