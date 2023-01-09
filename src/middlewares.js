import multer from "multer";

// locals는 pug와 express에서 모두 접근 가능하기 때문에 이러한 미들웨어를 사용해서 접근
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// 미들웨어를 사용해서 원하지 않는 사용자의 접근을 막을 수 있다.
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

// 다시 로그인페이지를 가지 못하게 막는 함수
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

// multer 사용
// req.file을 사용할 수 있음
// 프로필 사진용
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
});
// 비디오 파일용
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10000000 },
});
