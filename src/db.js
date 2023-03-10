import mongoose from "mongoose";

mongoose.set("strictQuery", false); // DeprecationWarning
mongoose.connect(process.env.DB_URL);

// 데이터베이스 연결 에러를 감지하도록
const db = mongoose.connection;
const handleError = (error) => console.log("❌ DB Error", error);
const handleOpen = () => console.log("✅ Connected to DB");
db.on("error", handleError); // 여러번 on
db.once("open", handleOpen); // 한번 once
