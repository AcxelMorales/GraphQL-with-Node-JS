const { Schema, model } = require('mongoose');

const teacherSchema = new Schema({
  name: String,
  age: Number,
  active: Boolean,
  date: String
});

const Teacher = model('teacher', teacherSchema);
module.exports = Teacher;