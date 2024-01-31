const mongoose = require("mongoose");

const userGameListSchema = new mongoose.Schema({
  _id: String, //  userNum
  gameList: [Number], // gameNum
});

module.exports = userGameListSchema;
