const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login // Please note that this line is not helping in logging in, it is actually the functionality for what to do after logging in, actual login is done by the code above this line, which is done by passport!
    );

router.get("/logout", userController.logout);

module.exports = router;

// ! Useful links:
// * Passport.js link: https://www.passportjs.org/concepts/authentication/login/
// * Passport.js link: https://www.passportjs.org/concepts/authentication/logout/
