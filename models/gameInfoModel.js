const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  코발트용
const UserGameSchema = new Schema({
  userNum: Number, // 유저 번호
  playTime: Number, // 게임 시간
  characterNum: Number, // 캐릭터 번호
  characterLevel: Number, //  레벨
  teamKill: Number, //  팀 총 킬 수
  playKill: Number, //  데스
  playAssistant: Number, //  어시
  damageToPlayer: Number, //  딜량
  finalInfusion: Array, //  인퓨전
  equipment: {
    // 착용 장비
    type: Map,
    of: String,
  }, //  착용장비
  sumTotalVFCredits: Number, //  최종 횟득 크래딧
});

const GameInfoSchema = new mongoose.Schema({
  _id: Number, // 게임 번호
  userGames: [UserGameSchema], // 게임 데이터
});

module.exports = GameInfoSchema;
