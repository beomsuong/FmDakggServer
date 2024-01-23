const mongoose = require("mongoose");
require("dotenv").config();

const userInfoSchema = new mongoose.Schema({
  _id: String,//userNum
  gameList: [{
    gameId: String, 
    timestamp: Date 
  }],
});

const gameInfoSchema = new mongoose.Schema({
  _id: String,//gameNum
  id: Number,
});


const UserInfo = mongoose.model('UserInfo', userInfoSchema, 'userInfo');
const gameInfo = mongoose.model('gameInfo', gameInfoSchema, 'gameInfo');
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("DB connected");

    const newUser = new UserInfo({_id:'123', id: 100 });
    await newUser.save();
    console.log('성공');

  } catch (err) {
    console.error('실패:', err);
  }
};

module.exports = dbConnect;