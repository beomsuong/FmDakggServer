const express = require("express");
const dbConnect = require("./config/dbConnect");
const https = require('https'); 

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const port = 3000;

dbConnect();

app.use(express.json());


app.listen(port, () => {
  console.log(`${port}번 포트에서 서버 실행 중`);
});
let userData = new Map();
let gameData = new Map();
///유저 Num조회
const getUserNum = async (nickname) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'open-api.bser.io',
      port: 443,
      path: '/v1/user/nickname?query=' + nickname,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.eternalreturnAPIKey
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          userData.set(parsedData.user.nickname, { userNum: parsedData.user.userNum });
          resolve(parsedData); 
        } catch (error) {
          reject(error);
        }
      });
    });

    apiReq.on('error', (e) => {
      reject(e);
    });

    apiReq.end();
  });
};


///유저의 최근 게임 목록 
const getUserGameList= async (nickname) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'open-api.bser.io',
      port: 443,
      path: '/v1/user/games/'+ userData.get(nickname)?.userNum ,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.eternalreturnAPIKey
      }
    };
  
    const apiReq = https.request(options, (apiRes) => {
      let data = '';
  
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
  
      apiRes.on('end', () => {
        try {
          const obj = JSON.parse(data);
          const gameIds = obj['userGames'].map(game => game['gameId']);
        
          userData.get(nickname).dataList = gameIds; //최근 10게임 추가
          console.log('종료');
          resolve(gameIds); 

        } catch (error) {
          console.error(error);
        }
      });
    });
  
    apiReq.on('error', (e) => {
      console.error(e);
      res.send("Internal Server Error");
    });
  
    apiReq.end();
  });
};


const getGameData= async (gameId) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'open-api.bser.io',
      port: 443,
      path: '/v1/games/'+ gameId ,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.eternalreturnAPIKey
      }
    };
  
    const apiReq = https.request(options, (apiRes) => {
      let data = '';
  
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
  
      apiRes.on('end', () => {
        try {
          const obj = JSON.parse(data);
        
          resolve(obj); 

        } catch (error) {
          console.error(error);
        }
      });
    });
  
    apiReq.on('error', (e) => {
      console.error(e);
      res.send("Internal Server Error");
    });
  
    apiReq.end();
  });
};


app.get('/player/:nickname', async (req, res) => {
  const nickname = encodeURIComponent(req.params.nickname);

  if (!userData.get(nickname)) { // 사전에 조회하지 않은 유저일 때
    try {
      await getUserNum(nickname);    
      console.log('유저 조회');

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }

  const userNum = userData.get(nickname)?.userNum;
  if (!userNum) {
    res.status(404).send("User not found");
    return;
  }    try {
  await getUserGameList(nickname);
  }

  catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
  
 
 
  console.log(userData.get('aasam')['dataList'][0]);
 
  res.send( await getGameData(userData.get('aasam')['dataList'][0]));

});