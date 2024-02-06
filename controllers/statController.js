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

/// 코발트만 할까요?
const updateCharacterStats = async (GameInfo) => {
  console.log(GameInfo.length);
  if (GameInfo.length === 8) {
    updateCharacterCobaltStats(GameInfo);
  } else {
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
  }
};
/// 루미아섬 통계용
const updateCharacterRumiaStats = async (GameInfo) => {
  const existingDocument = await characterRumiaStat.findOne({
    _id: characterNumToName.get(GameInfo).userNum,
  });
  if (existingDocument) {
    return existingDocument.gameList;
  }
};
module.exports = {
  updateCharacterStats,
  updateCharacterCobaltStats,
  updateCharacterRumiaStats,
};
