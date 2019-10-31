const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  name     : String,
  language : String,
  date     : String,
  teacherId: String
});

const Course = model('course', courseSchema);
module.exports = Course;