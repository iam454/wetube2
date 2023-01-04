// Video import
import Video from "../models/Video";

// 메인 홈페이지 home.pug
export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos: videos }); // home.pug를 찾아서 렌더링하고, pageTitle이라는 변수를 넘김
};

// 비디오 페이지 watch.pug
export const watch = (req, res) => {
  return res.render("watch", { pageTitle: `Watching` });
};

// 비디오 수정 페이지 edit.pug
export const getEdit = (req, res) => {
  return res.render("edit", {
    pageTitle: `Editing:`,
  });
};

// 비디오 수정 post
export const postEdit = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  return res.redirect(`/videos/${id}`);
};

// 비디오 업로드 upload.pug
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

// 비디오 업로드 post
export const postUpload = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  // 두 가지 방법
  /*
  1. new -> save

  const video = new Video({
    title: title,
    description: description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await video.save();

  */
  // 2. create
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
