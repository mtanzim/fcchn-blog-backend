module.exports = function (req, res, next) {
  console.log('')
  console.log('Checking Session Authentication:')
  console.log("isAuthenticated: " + req.isAuthenticated())
  if (req.isAuthenticated()) {
    console.log("User credentials:");
    console.log(req.user);
  }
  console.log('')
  next();
};