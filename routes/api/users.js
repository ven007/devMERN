const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
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
    const { name, email, password } = req.body;

    //find if user already exists
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json([{ errors: 'user already exists' }]);
      }

      //find the avatar pic of the user using email
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

      //load the data into the user model
      user = new User({ name, email, avatar, password });

      //salt  and hashthe password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //finally save the data into the DB
      await user.save();
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
