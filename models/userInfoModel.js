const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  _id: String, //  userNum
  gameList: [Number], // gameNum
});

module.exports = userInfoSchema;
