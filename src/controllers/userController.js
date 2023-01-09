import User from "../models/User";
import fetch from "node-fetch"; // nodejs에서 fetch를 사용하기 위해 설치
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
  const user = await User.findOne({ username: username, socialOnly: false });
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

// github 로그인 start
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString(); // url 깔끔하게 정리
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

// github 로그인 finish
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token"; // github로부터 토큰을 얻어오는 과정
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // 토큰을 얻었을때 user, email 데이터를 가져오는 과정
  if ("access_token" in tokenRequest) {
    const access_token = tokenRequest.access_token;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    // 이메일이 없다면
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email }); // 유저가 존재하는지 확인
    if (!user) {
      // 존재하지 않는다면 새 User를 만든다
      user = await User.create({
        name: userData.name ? userData.name : "Unknown",
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

// 로그아웃
export const logout = (req, res) => {
  req.session.destroy(); // 세션 종료
  return res.redirect("/");
};

// 유저 프로필 수정 페이지 edit-profile.pug
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

// 유저 프로필 수정 post
export const postEdit = async (req, res) => {
  const user = req.session.user._id;
  const avatarUrl = req.session.user.avatarUrl;
  const { name, email, username, location } = req.body;
  const file = req.file;
  // 로그인된 session값을 DB와 연결해서 업데이트
  const updatedUser = await User.findByIdAndUpdate(
    user,
    {
      avatarUrl: file ? file.path : avatarUrl, // 업로드한 파일이 있으면 그걸로, 아닌 경우엔 기존값
      name: name,
      email: email,
      username: username,
      location: location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

// 비밀번호 변경 change-password.pug
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", {
    pageTitle: "Changing Password",
  });
};

// 비밀번호 변경 post
export const postChangePassword = async (req, res) => {
  const userID = req.session.user._id;
  const user = await User.findById(userID);
  const { oldPassword, newPassword, newPasswordConfirmation } = req.body;
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Changing Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Changing Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPassword;
  await user.save();
  res.redirect("/users/logout");
};

// 유저 프로필
export const see = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  return res.render("users/profile", {
    pageTitle: `${user.name}의 Profile`,
    user: user,
  });
};
