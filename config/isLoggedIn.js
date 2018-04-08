'use strict';
module.exports = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //return res.send(403, { error: "Please log in!" });
        return res.status(403).send({error: "Please log in"});
    }
}