/* eslint-disable new-cap */
const https = require("https");
const { userData } = require("../global");
const userInfoSchema = require("../models/userInfoModel");
const gameInfoSchema = require("../models/gameInfoModel");
const mongoose = require("mongoose");

const userInfo = mongoose.model("userInfo", userInfoSchema);
const gameInfo = mongoose.model("gameInfo", gameInfoSchema);
/// 유저의 최근 게임 목록
const getUserGameList = async (nickname) => {
  // 시간 변수 추가해서 동일 전적은 자주 못보게 할 예정
  const existingDocument = await userInfo.findOne({
    _id: userData.get(nickname).userNum,
  });
  if (existingDocument) {
    return existingDocument.gameList;
  }
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "open-api.bser.io",
      port: 443,
      path: "/v1/user/games/" + userData.get(nickname).userNum,
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Api-Key": process.env.eternalreturnAPIKey,
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => {
        data += chunk;
      });
      apiRes.on("end", async () => {
        try {
          const obj = JSON.parse(data);
          const gameIds = obj.userGames.map((game) => game.gameId);

          try {
            await userInfo.findOneAndUpdate(
              { _id: userData.get(nickname).userNum },
              { gameList: gameIds },
              { upsert: true }
            );
            resolve(gameIds); // 결과 반환
          } catch (error) {
            console.error("Error inserting data:", error);
            reject(error); // 에러 처리
          }
        } catch (error) {
          console.error(error);
          reject(error); // JSON 파싱 에러 처리
        }
      });
    });

    apiReq.on("error", (e) => {
      console.error(e);
      reject(e); // HTTP 요청 에러 처리
    });

    apiReq.end();
  });
};

/// 게임정보
const getGameData = async (gameId) => {
  // 먼저 문서가 존재하는지 확인
  // const existingDocument = await gameInfo.findOne({ _id: gameId });
  // if (existingDocument) {
  //   return existingDocument; // 문서가 이미 존재하면 문서 반환
  // }
  // API 요청 옵션
  const options = {
    hostname: "open-api.bser.io",
    port: 443,
    path: "/v1/games/" + gameId,
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Api-Key": process.env.eternalreturnAPIKey,
    },
  };

  // API 요청 및 처리
  return new Promise((resolve, reject) => {
    const apiReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => {
        data += chunk;
      });
      apiRes.on("end", async () => {
        try {
          const obj = JSON.parse(data);
          const savedGameInfo = await gameInfo.findOneAndUpdate(
            { _id: gameId },
            { userGames: obj.userGames },
            { upsert: true }
          );
          resolve(savedGameInfo); // 저장한 데이터 반환
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    });
    apiReq.on("error", (e) => {
      console.error(e);
      reject(e);
    });

    apiReq.end();
  });
};

module.exports = {
  getUserGameList,
  getGameData,
};
