'use strict';
 

function isLoggedIn(req, res, next) {
    // console.log(req.body);
    // console.log(req.session);
    console.log('Checking isLogged in:')
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        console.log('Logged in! Going next!')
        next();
    } else {
        const err = { name: 'authError', message: `Please log in!` }
        // return res.send(403, { error: "Please log in!" });
        //  res.status(403).send({error: "Please log in"});
        //  e.status
         next(err);
    }
}

export default isLoggedIn;