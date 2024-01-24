const mongoose = require("mongoose");

const gameInfoSchema = new mongoose.Schema({
    _id: String,//gameNum
    id: Number, 
  });

  module.exports =  gameInfoSchema;