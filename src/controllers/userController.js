import User from "../models/User";

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
  await User.create({
    name: name,
    username: username,
    email: email,
    password: password1,
    location: location,
  });
  return res.redirect("/login");
};
export const login = (req, res) => res.send("Login");
