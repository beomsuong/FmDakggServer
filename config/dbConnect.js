const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {});
    console.log("DB 연결 성공");
  } catch (err) {
    console.error("DB 연결 실패:", err);
  }
};
module.exports = dbConnect;
