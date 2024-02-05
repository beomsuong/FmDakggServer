/// 전적 컨트롤러
// const https = require("https");
const { characterNumToName } = require("../global");
// const characterStatSchema = require("../models/characterStatModel");
// const characterStat = mongoose.model("userGameList", characterStatSchema);

/// 코발트만 할까요?
const updateCharactersStats = async (GameInfo) => {
  for (const data of GameInfo) {
    console.log(characterNumToName.get(data.characterNum)); // 각각 캐릭터 데이터
    //   const existingDocument = await characterStat.findOne({
    //     _id: characterNumToName.get(GameInfo).userNum,
    //   });
    //   if (existingDocument) {
    //     return existingDocument.gameList;
    //   }
  }
};
module.exports = {
  updateCharactersStats,
};
