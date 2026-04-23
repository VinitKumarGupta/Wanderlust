const User = require("../models/user");

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                success: true,
                user: registeredUser,
                flash: { success: "Welcome to Wanderlust!" },
            });
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
            flash: { error: err.message },
        });
    }
};

module.exports.login = async (req, res) => {
    res.json({
        success: true,
        user: req.user,
        flash: { success: "Welcome to Wanderlust! You're logged in!" },
    });
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({
            success: true,
            flash: { success: "You are logged out!" },
        });
    });
};
