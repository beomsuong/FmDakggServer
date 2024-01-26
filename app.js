const express = require("express");
const dbConnect = require("./config/dbConnect");
const fs = require('fs');

const https = require('https'); 
const path = require('path');

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");



let characterNumToName = new Map();


dbConnect();

///서버 시작 시 CharacterNum 읽어와 Map에 저장
 fs.readFile('l10n-English-20240124065616.txt', 'utf8', (err, data) => {
  const lines = data.split('\n');
  const targetCharacterNumber = 3; 
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [number, characterName] = line.split('┃');
  
    if (number.split('/')[0] != `Character`) {
      break;
    }
    characterNumToName.set(i, characterName.slice(0, -2));
  }
  console.log('characterNumToName 완료');
});

app.use(express.json());
app.listen(3000, () => {
  console.log(`서버 시작`);
});
let userData = new Map();
let gameData = new Map();

app.get("/getImage", async (req, res) => {
  res.sendFile(path.join(__dirname, `./123.jpg`));
});

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