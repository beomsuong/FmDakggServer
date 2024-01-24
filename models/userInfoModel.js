const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
    _id: String,//userNum
    gameList: [{ 
      gameId: String, //gameNum
      timestamp: Date //gameDate
    }],
  });
  
  module.exports =userInfoSchema;