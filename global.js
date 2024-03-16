// 몽고디비 저장전 임시로 전역변수에 저장함
const userData = new Map();
const gameData = new Map();
const characterNumToName = new Map();
// eslint-disable-next-line space-before-function-paren
function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  delay,
  userData,
  gameData,
  characterNumToName,
};
