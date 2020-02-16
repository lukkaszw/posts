const isAuth = (req, res, next) => {
  if(!req.user) {
    res.status(401).json({
      error: {
        message: 'Unauthorized client!',
      }
    });
    return;
  }
  req.userEmail = req.user.emails[0].value;
  next();
};

module.exports = isAuth;