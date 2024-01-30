const express = require("express");
const dbConnect = require("./config/dbConnect");
const fs = require("fs");
const userController = require("./controllers/userController");
const gameController = require("./controllers/gameController");

// const https = require('https');
const path = require("path");
const { userData } = require("./global");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const characterNumToName = new Map();

dbConnect();

/// 서버 시작 시 CharacterNum 읽어와 Map에 저장
fs.readFile("l10n-English-20240124065616.txt", "utf8", (_err, data) => {
  const lines = data.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [number, characterName] = line.split("┃");

    if (number.split("/")[0] !== "Character") {
      break;
    }
    characterNumToName.set(i, characterName.slice(0, -1));
  }
  console.log("characterNumToName 완료");
});

app.use(express.json());
app.listen(3000, () => {
  console.log("서버 시작");
});

app.get("/getImage", async (req, res) => {
  res.sendFile(path.join(__dirname, "./123.jpg"));
});

app.get("/player/:nickname", async (req, res) => {
  const nickname = encodeURIComponent(req.params.nickname);
  if (!userData.get(nickname)) {
    // 사전에 조회하지 않은 유저일 때
    try {
      await userController.getUserNum(nickname);
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }
  const userNum = userData.get(nickname)?.userNum;
  if (!userNum) {
    res.status(404).send("User not found");
    return;
  }
  const gamedata = [];
  try {
    const gameIds = await gameController.getUserGameList(nickname);
    console.log(gameIds);
    for (const gameId of gameIds) {
      gamedata.push(await gameController.getGameData(gameId));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("너무 자주 시도하심");
    return;
  }
  res.send(gamedata);
});
