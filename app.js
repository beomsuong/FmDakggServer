const express = require("express");
const dbConnect = require("./config/dbConnect");
const fs = require("fs");
const userController = require("./controllers/userController");
const gameController = require("./controllers/gameController");

// const https = require('https');
const path = require("path");
const { userData } = require("./global");
const { characterNumToName } = require("./global");
require("dotenv").config();

const app = express();

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
  console.log(userData.get("nickname")?.userNum == null);
});

app.use(express.json());
app.listen(3000, () => {
  console.log("서버 시작");
});

app.get("/rankTierIMGImage/", async (req, res) => {
  const filePath = path.join(__dirname, "assets", "RankTierIMG", "Titan.png");
  res.sendFile(filePath);
});

app.get("/charactersImage/:characterNum", async (req, res) => {
  const characterNum = req.params.characterNum;
  const filePath = path.join(
    __dirname,
    "assets",
    "MainCharacter",
    `${characterNumToName.get(parseInt(characterNum))}.png`
  );

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      /// 이미지 파일 없는 경우
      res.sendFile(path.join(__dirname, "/assets/MainCharacter/0.png"));
    } else {
      res.sendFile(filePath);
    }
  });
});

app.get("/weaponsImage/:weaponsNum", async (req, res) => {
  const weaponsNum = req.params.weaponsNum;
  const filePath = path.join(
    __dirname,
    "assets",
    "weapons",
    `${weaponsNum}.png`
  );
  res.sendFile(filePath);
});

app.get("/chestImage/:chestNum", async (req, res) => {
  const chestNum = req.params.chestNum;
  const filePath = path.join(__dirname, "assets", "Chest", `${chestNum}.png`);
  res.sendFile(filePath);
});

app.get("/headImage/:headNum", async (req, res) => {
  const headNum = req.params.headNum;
  const filePath = path.join(__dirname, "assets", "head", `${headNum}.png`);
  res.sendFile(filePath);
});

app.get("/LegImage/:legNum", async (req, res) => {
  const legNum = req.params.legNum;
  const filePath = path.join(__dirname, "assets", "Leg", `${legNum}.png`);
  res.sendFile(filePath);
});

app.get("/armImage/:armNum", async (req, res) => {
  const armNum = req.params.armNum;
  const filePath = path.join(__dirname, "assets", "Arm", `${armNum}.png`);
  res.sendFile(filePath);
});

/// 유저 Num조회
app.get("/v1/user/num/:nickname", async (req, res) => {
  console.log("닉네임 요청");
  const nickname = req.params.nickname;
  if (!userData.get(nickname)) {
    // 사전에 조회하지 않은 유저일 때
    try {
      res.send(await userController.getUserNum(nickname));
    } catch (error) {
      console.error(error);
    }
  } else {
    res.send(userData.get(nickname));
  }
});

/// 유저 정보 검색
app.get("/v1/user/stats/:nickname", async (req, res) => {
  const nickname = encodeURIComponent(req.params.nickname);
  console.log("유저 정보 검색 요청");
  if (userData.get(nickname)?.userNum == null) {
    // 사전에 조회하지 않은 유저일 때
    try {
      await userController.getUserNum(nickname);
    } catch (error) {
      console.error(error);
    }
  }
  const UserStat = await userController.getUserStats(
    userData.get(nickname).userNum
  );
  console.log("유저 정보 " + UserStat.userStats);
  res.send(UserStat);
});

/// 유저 최근 10게임 조회
app.get("/player/:nickname", async (req, res) => {
  const nickname = req.params.nickname;
  console.log("전적 조회 요청" + nickname);
  if (!userData.get(nickname)?.userNum) {
    // 사전에 조회하지 않은 유저일 때
    try {
      await userController.getUserNum(nickname);
    } catch (error) {
      res.status(404).send("userNum 조회 실패");
      return;
    }
  }
  const userNum = userData.get(nickname)?.userNum;
  if (!userNum) {
    console.log("저장된 회원 정보 없음");
    res.status(404).send("User not found");
    return;
  }
  console.log("회원 번호 " + userNum);
  const gameData = []; // 게임 데이터 반환용
  try {
    const gameIds = await gameController.getUserGameList(nickname);
    console.log(gameIds);
    for (const gameId of gameIds) {
      gameData.push(await gameController.getGameData(gameId));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("너무 자주 시도하심");
    return;
  }
  console.log("끝");
  res.json({
    gameData,
    userNum: userData.get(nickname).userNum, // 예시에서는 이 부분을 수정했습니다.
  });
});
