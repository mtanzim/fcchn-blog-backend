'use strict';
module.exports = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.send(403, { error: "Please log in!" });
    }
}