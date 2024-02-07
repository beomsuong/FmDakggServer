/// 전적 컨트롤러
// const https = require("https");
const { characterNumToName } = require("../global");
const characterCobaltStatSchema = require("../models/characterStatModel");
const characterRumiaStatSchema = require("../models/characterStatModel");
const mongoose = require("mongoose");
const characterCobaltStat = mongoose.model(
  "cobaltStat",
  characterCobaltStatSchema
);
const characterRumiaStat = mongoose.model(
  "RumiaStat",
  characterRumiaStatSchema
);

const updateCharacterStats = async (GameInfo) => {
  console.log(GameInfo.length);
  if (GameInfo.length === 8) {
    /// 플레이어가 8명이면 코발트
    updateCharacterCobaltStats(GameInfo);
  } else {
    /// 루미아섬 통계
    updateCharacterCobaltStats(GameInfo);
  }
};

// 코발트 통계용
const updateCharacterCobaltStats = async (GameInfo) => {
  const existingDocument = await characterCobaltStat.findOne({
    _id: characterNumToName.get(GameInfo).userNum,
  });
  if (existingDocument) {
    return existingDocument.gameList;
  } else {
    // 첫 전적 시
    await characterCobaltStat.findOneAndUpdate(
      {
        _id: characterNumToName.get(GameInfo).userNum,
        numberOfGames: 1,
      },
      {
        $set: {
          time: new Date(),
          userStats: GameInfo,
        },
      },
      { upsert: true } // 없으면 새로 생성
    );
  }
};
/// 루미아섬 통계용
const updateCharacterRumiaStats = async (GameInfo) => {
  const existingDocument = await characterRumiaStat.findOne({
    _id: characterNumToName.get(GameInfo).userNum,
  });
  if (existingDocument) {
    return existingDocument.gameList;
  } else {
    // 첫 전적 시
    await characterRumiaStat.findOneAndUpdate(
      {
        _id: characterNumToName.get(GameInfo).userNum,
        numberOfGames: 1,
      },
      {
        $set: {
          time: new Date(),
          userStats: GameInfo,
        },
      },
      { upsert: true } // 없으면 새로 생성
    );
  }
};
module.exports = {
  updateCharacterStats,
  updateCharacterCobaltStats,
  updateCharacterRumiaStats,
};
