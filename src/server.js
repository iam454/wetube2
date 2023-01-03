import express from "express";

const PORT = 4000;

const app = express();

// 홈페이지
const handleHome = (req, res) => {
  console.log(`Somebody is trying to go home`);
  res.send("Home Page");
};

// 로그인 페이지
const handleLogin = (req, res) => {
  console.log(`Somebody is trying to login`);
  res.send("Login Page");
};

// 서버 라우트
app.get("/", handleHome);
app.get("/login", handleLogin);

// 서버 연결
const handleListening = () =>
  console.log(`✅ Server is listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
