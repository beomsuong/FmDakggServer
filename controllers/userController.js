const https = require("https");
const { userData } = require("../global");

const mongoose = require("mongoose");
const userInfoSchema = require("../models/userInfoModel");
const userInfo = mongoose.model("userInfo", userInfoSchema);
/// 유저 Num조회
const getUserNum = async (nickname) => {
  console.log("유저 num 조회 저장 여부 " + userData.get(nickname)?.userNum);
  if (userData.get(nickname)?.userNum != null) {
    return userData.get(nickname)?.userNum;
  }
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "open-api.bser.io",
      port: 443,
      path: "/v1/user/nickname?query=" + nickname,
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
      console.log("반환 데이터 " + apiRes);
      apiRes.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          userData.set(parsedData.user.nickname, {
            userNum: parsedData.user.userNum,
          });
          console.log("번호 조회 완료");
          resolve(parsedData);
        } catch (error) {
          console.log("조회 실패 " + error);
          reject(error);
        }
      });
    });

    apiReq.on("error", (e) => {
      reject(e);
    });

    apiReq.end();
  });
};

/// 유저 프로필 조회
const getUserStats = async (userNum) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "open-api.bser.io",
      path: `/v1/user/stats/${userNum}/23`,
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
          const parsedData = JSON.parse(data).userStats;
          parsedData.time = new Date().toISOString();
          const savedUserInfo = await userInfo.findOneAndUpdate(
            {
              _id: userNum,
            },
            {
              $set: {
                time: new Date(),
                userStats: parsedData,
              },
            },
            { upsert: true } // 없으면 새로 생성
          );
          console.log("유저 데이터 " + savedUserInfo);
          resolve(savedUserInfo);
        } catch (error) {
          reject(error);
        }
      });
    });
    apiReq.on("error", (e) => {
      reject(e);
    });
    apiReq.end();
  });
};
module.exports = {
  getUserNum,
  getUserStats,
};
