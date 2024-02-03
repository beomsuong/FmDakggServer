/// 유저 프로필 정보
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userStateSchema = new Schema({
  time: String,
  mmr: Number,
  nickName: String,
  rank: Number,
  rankSize: Number,
  totalGames: Number,
  totalWins: Number,
  totalTeamKills: Number,
  totalDeaths: Number,
  escapeCount: Number,
  rankPercent: Number,
  averageRank: Number,
  averageKills: Number,
  averageAssistants: Number,
  averageHunts: Number,
  top1: Number,
  top2: Number,
  top3: Number,
  top5: Number,
  top7: Number,
});

const UserInfoSchema = new mongoose.Schema({
  _id: Number, //  userNum
  time: { type: Date }, // 데이터 조회 시간 저장 (잦은 갱신 방지)
  userStats: [userStateSchema],
});

module.exports = UserInfoSchema;
