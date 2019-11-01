const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

const User = require('../models/user.model');

const auth = {
  login: async (email, password, secretKey) => {
    const user = await User.findOne({ email });

    if (!user) return { error: 'Usuario o contraseña incorrectos' };
    if (!bcrypt.compareSync(password, user.password)) return { error: 'Usuario o contraseña incorrectos' };

    const token = await jwt.sign({
      _id: user._id,
      name: user.name,
      email: user.email,
      date: user.date
    }, secretKey);

    return { 
      message: 'Bienvenido',
      token
    };
  },
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization');

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.SEED_GRAPHQL_COURSES);
        req.user = payload;
        req.user.auth = true;
        return next();
      } catch (error) {
        req.user = { auth: false };
        return next();
      }
    } else {
      req.user = { auth: false };
      return next();
    }
  }
};

module.exports = auth;