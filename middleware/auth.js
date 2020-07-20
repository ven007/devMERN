const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  //if not token
  if (!token) {
    return res.status(401).json({ msg: 'no token, auth denied' });
  }

  try {
    const decode = jwt.verify(token, config.get('jwSecret'));
    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }

  //decode token
};
