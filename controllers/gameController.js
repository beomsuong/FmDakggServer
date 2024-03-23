const https = require("https");
const { userData } = require("../global");
const { delay } = require("../global");
const userGameListSchema = require("../models/userGameListModel");
const gameInfoSchema = require("../models/gameInfoModel");
// const statController = require("./statController");
const mongoose = require("mongoose");

const userGameList = mongoose.model("userGameList", userGameListSchema);
const gameInfo = mongoose.model("gameInfo", gameInfoSchema);

/// 유저의 최근 게임 목록
const getUserGameList = async (nickname) => {
  // 시간 변수 추가해서 동일 전적은 자주 못보게 할 예정
  const existingDocument = await userGameList.findOne({
    _id: userData.get(nickname).userNum,
  });
  if (existingDocument) {
    return existingDocument.gameList;
  }
  await delay(500);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "open-api.bser.io",
      port: 443,
      path: "/v1/user/games/" + userData.get(nickname).userNum, // 다음 전적을 보기 위한 next
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
        const obj = JSON.parse(data);
        const gameIds = obj.userGames.map((game) => game.gameId);
        resolve(gameIds); // 결과 반환
        // try {
        //   const obj = JSON.parse(data);
        //   const gameIds = obj.userGames.map((game) => game.gameId);
        //   try {
        //     await userGameList.findOneAndUpdate(
        //       { _id: userData.get(nickname).userNum },
        //       { gameList: gameIds },
        //       { upsert: true }
        //     );
        //     resolve(gameIds); // 결과 반환
        //   } catch (error) {
        //     console.error("Error inserting data:", error);
        //     reject(error); // 에러 처리
        //   }
        // } catch (error) {
        //   console.error(error);
        //   reject(error); // JSON 파싱 에러 처리
        // }
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
const getGameData = async (gameId, attempt = 0) => {
  const existingDocument = await gameInfo.findOne({ _id: gameId });
  if (existingDocument) {
    return existingDocument;
  }

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

  return new Promise((resolve, reject) => {
    const apiReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => {
        data += chunk;
      });
      apiRes.on("end", async () => {
        try {
          const obj = JSON.parse(data);
          if (!obj.userGames) {
            console.log("조회 실패 또는 userGames가 없음 " + gameId);
            // 최대 재시도 횟수 설정
            if (attempt < 3) {
              console.log(`재시도 중... (${attempt + 1})`);
              setTimeout(() => getGameData(gameId, attempt + 1), 2000);
            } else {
              console.log("최대 재시도 횟수 초과");
            }
            reject(new Error("userGames is null or not found"));
            return;
          }

          const savedGameInfo = await gameInfo.findOneAndUpdate(
            { _id: gameId },
            { userGames: obj.userGames },
            { upsert: true }
          );
          console.log("게임 정보 저장 및 반환 ", obj.userGames);
          resolve(savedGameInfo);
        } catch (error) {
          console.error("데이터 처리 중 오류 발생: ", error);
          reject(error);
        }
      });
    });

    apiReq.on("error", (e) => {
      console.error("API 요청 중 오류 발생: ", e);
      reject(e);
    });

    apiReq.end();
  });
};

module.exports = {
  getUserGameList,
  getGameData,
};
