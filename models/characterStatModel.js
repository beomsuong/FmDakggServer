/// 실험체 통계
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 섬 노말 + 랭크? 통계
const rumiaStatSchema = new Schema({
  totalGames: Number,
  totalWins: Number,
  totalTeamKills: Number, // 개인킬로 바꾸기?
  top3: Number,
});

const characterRumiaStatSchema = new mongoose.Schema({
  _id: Number, // 캐릭터 Num
  numberOfGames: Number, // 게임 수
  Stat: [rumiaStatSchema], // 게임 데이터
});
const cobaltStatSchema = new Schema({
  totalGames: Number,
  totalWins: Number,
  totalTeamKills: Number, // 개인킬로 바꾸기?
  top3: Number,
});

// 코발트 통계
const characterCobaltStatSchema = new mongoose.Schema({
  _id: Number, // 캐릭터 Num
  numberOfGames: Number, // 게임 수
  Stat: [cobaltStatSchema], // 게임 데이터
});

module.exports = {
  characterRumiaStatSchema,
  characterCobaltStatSchema,
};
