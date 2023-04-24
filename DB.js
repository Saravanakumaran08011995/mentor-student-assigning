const mongoose = require("mongoose");
// ----------------------------------
//? Connect to the MongoDB database
const MongoDbConnection = async () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
};
// ----------------------------------
module.exports = { MongoDbConnection };
// ----------------------------------