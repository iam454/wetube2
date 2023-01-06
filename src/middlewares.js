// locals는 pug와 express에서 모두 접근 가능하기 때문에 이러한 미들웨어를 사용해서 접근
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
};
