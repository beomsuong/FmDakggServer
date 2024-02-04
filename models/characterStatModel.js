/// 실험체 통계
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatSchema = new Schema({
  totalGames: Number,
  totalWins: Number,
  totalTeamKills: Number, // 개인킬로 바꾸기?
  top3: Number,
});

const CharacterStatSchema = new mongoose.Schema({
  _id: Number, // 캐릭터 Num
  Stat: [StatSchema], // 게임 데이터
});

module.exports = CharacterStatSchema;
