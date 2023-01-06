import User from "../models/User";
import bcrypt from "bcrypt";

// 회원가입 페이지 join.pug
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

// 회원가입 post
export const postJoin = async (req, res) => {
  const { name, username, email, password1, password2, location } = req.body; // ES6 req.body.name 등 같은 표현
  const pageTitle = "Join";
  if (password1 !== password2) {
    return res.status(400).render("join", {
      // status로 상태코드를 표현할 수 있다. 400 : bad request
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const usernameExists = await User.exists({ username: username }); // username 중복검사
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Sorry, this username is already taken.",
    });
  }
  const emailExists = await User.exists({ email: email }); // email 중복검사
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Sorry, this email is already taken.",
    });
  }
  // $or 사용 username과 email의 중복검사를 한번에 할 수 있음
  /*
  const exists = await User.exists({
    $or: [{ username: username, email: email }],
  });
  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Sorry, this username/email is already taken.",
    });
  }
  */
  try {
    await User.create({
      name: name,
      username: username,
      email: email,
      password: password1,
      location: location,
    });
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
  return res.redirect("/login");
};

// 로그인 페이지 login.pug
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Log in" });
};

// 로그인 post
export const postLogin = async (req, res) => {
  const { username, password1 } = req.body;
  const pageTitle = "Login";
  // 계정이 존재하는지 확인
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  // 비밀번호가 맞는지 확인
  const ok = await bcrypt.compare(password1, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true; // 로그인한 유저가 있는 경우 session에 값을 추가
  req.session.user = user;
  res.redirect("/");
};
