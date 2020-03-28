exports.googleLogin = (req, res, next) => {
  if (!req.user) {
    return res.send(500, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id
  };
  next();
}