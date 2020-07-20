const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
});

router.post(
  '/',
  [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').isLength({ min: 6 }),
  ],
  async (req, res) => {
    //data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    //load the body data into variables
    const { email, password } = req.body;

    //find if user already exists
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json([{ errors: 'user not found' }]);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json([{ errors: 'pass no match' }]);
      }

      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get('jwSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
