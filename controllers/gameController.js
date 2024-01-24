const https = require('https'); 

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
  
  
///게임정보
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

  module.exports = {
    getUserGameList,
    getGameData
  };
  