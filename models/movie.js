const mongoose = require("mongoose");
const joi = require("joi");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
