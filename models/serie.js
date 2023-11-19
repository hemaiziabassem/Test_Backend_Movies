const mongoose = require("mongoose");
const Joi = require("joi");

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  numberOfEpisodes: {
    type: Number,
    required: true,
  },
  seasons: {
    type: Number,
    required: true,
  },
});

const Serie = mongoose.model("Series", seriesSchema);

module.exports = Serie;
