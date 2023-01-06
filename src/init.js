// 서버에 필요한 것들을 초기화
// .env 파일에 접근하기 위해 설치 dotenv
import "dotenv/config";

// 데이터베이스 연결을 위한 import
import "./db";

// 비디오 모델을 사용하기 위한 import
import "./models/Video";
// 유저 모델을 사용하기 위한 import
import "./models/User";

// 서버 시작을 위한 import
import app from "./server";

const PORT = 4000;

// 서버 연결
const handleListening = () =>
  console.log(`✅ Server is listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
