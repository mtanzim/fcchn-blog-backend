import httpStatus from 'http-status';
'use strict';


function validateUserCommon(req, res, next, contentUser) {
    console.log('Validating user:')
    console.log(contentUser.toString());
    console.log(req.user._id.toString());
    
    if (contentUser.toString() !== req.user._id.toString()) {
        //console.log('Comparing user of Post and Session!')
        let err = {
            name: 'authError',
            status: httpStatus.UNAUTHORIZED,
            message: 'User is not authorized to edit post!'
        }
        console.log('returning error from user Validation');
        next(err);
    } else {
        next()
    }
    // next()
}

export default validateUserCommon;