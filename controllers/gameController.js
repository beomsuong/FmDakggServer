/* eslint-disable new-cap */
const https = require("https");
const { userData } = require("../global");
const userInfoSchema = require("../models/userInfoModel");
const mongoose = require("mongoose");

const userInfo = mongoose.model("userInfo", userInfoSchema);

/// 유저의 최근 게임 목록
const getUserGameList = async (nickname) => {
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
            // 새로운 GameInfo 인스턴스 생성

            console.log(gameIds);
            await userInfo.findOneAndUpdate(
              { _id: userData.get(nickname).userNum },
              { gameList: gameIds },
              { upsert: true }
            );
            console.log(gameIds);
          } catch (error) {
            console.error("Error inserting data:", error);
          }
          userData.get(nickname).dataList = gameIds; // 최근 10게임 추가
          console.log("종료");
          resolve(gameIds);
        } catch (error) {
          console.error(error);
        }
      });
    });

    apiReq.on("error", (e) => {
      console.error(e);
    });

    apiReq.end();
  });
};

/// 게임정보
const getGameData = async (gameId) => {
  return new Promise((resolve, reject) => {
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

    const apiReq = https.request(options, (apiRes) => {
      let data = "";

      apiRes.on("data", (chunk) => {
        data += chunk;
      });

      apiRes.on("end", () => {
        try {
          const obj = JSON.parse(data);

          resolve(obj);
        } catch (error) {
          console.error(error);
        }
      });
    });

    apiReq.on("error", (e) => {
      console.error(e);
    });

    apiReq.end();
  });
};

module.exports = {
  getUserGameList,
  getGameData,
};
