const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//  코발트용
const userGameSchema = new Schema({
  userNum: Number,
  playTime: Number,
  characterNum: Number,
  characterLevel: Number, //  레벨
  teamKill: Number, //  팀 총 킬 수
  playKill: Number, //  데스
  playAssistant: Number, //  어시
  damageToPlayer: Number, //  딜량
  finalInfusion: Array, //  인퓨전
  equipment: Map, //  착용장비
  sumTotalVFCredits: Number//  최종 횟득 크래딧
});

const gameInfoSchema = new mongoose.Schema({
  _id: String, // gameNum
  id: Number,
  userGames: [userGameSchema]
});

module.exports = gameInfoSchema;
