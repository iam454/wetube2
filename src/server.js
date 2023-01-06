import express from "express";
import morgan from "morgan"; // 어떤 method로 어떤 url에 접근하는지 알기 위해 morgan 사용
import session from "express-session"; // 로그인 상태를 알기 위해 session

// 라우터들을 import
import globalRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); // view engine으로 pug를 사용
app.set("views", process.cwd() + "/src/views"); // package.json에서 실행하고 있기 때문에 process.cwd()는 /wetube2 까지임

// app.use() -> global middleware을 사용하게 함 (모든 라우트에서 이 미들웨어를 사용)
// global middleware을 통과하고 app.get()을 시도함
app.use(logger); // global middleware (어떤 method로 어떤 url에 접근하는지 알기 위한 logger)

app.use(express.urlencoded({ extended: true })); // express가 form의 value를 이해하게 함

// 로그인 유저를 알기 위한 session
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(localsMiddleware);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
