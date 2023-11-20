const mongoose = require("mongoose");

function db_connect() {
  try {
    mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/test-movie-api"
    );
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("cannot connect", error);
  }
}

module.exports = db_connect;
