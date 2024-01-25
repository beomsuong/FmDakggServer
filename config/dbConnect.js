const mongoose = require("mongoose");
const userInfoSchema = require("../models/userInfoModel");
const gameInfoSchema = require("../models/gameInfoModel");
require("dotenv").config();



// const UserInfo = mongoose.model('userInfo', userInfoSchema, 'userInfo');
// const gameInfo = mongoose.model('gameInfo', gameInfoSchema, 'gameInfo');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
    });
    console.log("DB connected");

    // const gameInfo = mongoose.model('gameInfo', gameInfoSchema, 'gameInfo');
    // const UserInfo = mongoose.model('userInfo', userInfoSchema, 'userInfo');
    
    // const newUser = new gameInfo({ _id: 112300,id: 112300 });
    // await newUser.save();

 
    console.log('DB 연결 성공');

  } catch (err) {
    console.error('DB 연결 실패:', err);
  }
};

module.exports = dbConnect;