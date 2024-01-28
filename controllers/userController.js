const https = require("https");
const { userData } = require("../global");

/// 유저 Num조회
const getUserNum = async (nickname) => {
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
      apiRes.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          userData.set(parsedData.user.nickname, {
            userNum: parsedData.user.userNum,
          });
          resolve(parsedData);
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
};
