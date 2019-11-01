const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    unique: true
  },
  password: String,
  date: String
});

const User = model('user', userSchema);
module.exports = User;