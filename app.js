const express = require("express");
const dbConnect = require("./config/dbConnect");
const fs = require('fs');

const https = require('https'); 
const path = require('path');

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const port = 3000;

dbConnect();

app.use(express.json());

///서버 시작 시 CharacterNum 읽어오기
fs.readFile('l10n-English-20240124065616.txt', 'utf8', (err, data) => {
  const lines = data.split('\n');
  const targetCharacterNumber = 3; 
  for (const line of lines) {
    const [number, characterName] = line.split('┃');
    if (number.split('/')[0]!= `Character`) {
      break; 
    }
    
    console.log(number);
  }
});


app.listen(port, () => {
  console.log(`${port}번 포트에서 서버 실행 중`);
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