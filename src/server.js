import express from "express";
import morgan from "morgan"; // 어떤 method로 어떤 url에 접근하는지 알기 위해 morgan 사용

const PORT = 4000;

const app = express();
const logger = morgan("dev");

// 홈페이지
const handleHome = (req, res) => {
  console.log(`Somebody is trying to go home`);
  return res.send("Home Page");
};

// 로그인 페이지
const handleLogin = (req, res) => {
  console.log(`Somebody is trying to login`);
  return res.send("Login Page");
};

// 서버 라우트
// app.use() -> global middleware을 사용하게 함 (모든 라우트에서 이 미들웨어를 사용)
// global middleware을 통과하고 app.get()을 시도함
app.use(logger); // global middleware (어떤 method로 어떤 url에 접근하는지 알기 위한 logger)

app.get("/", handleHome);
app.get("/login", handleLogin);

// 서버 연결
const handleListening = () =>
  console.log(`✅ Server is listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
