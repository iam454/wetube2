// Video import
import Video from "../models/Video";

// 메인 홈페이지 home.pug
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }); // sort로 최신을 위에
  return res.render("home", { pageTitle: "Home", videos: videos }); // home.pug를 찾아서 렌더링하고, pageTitle이라는 변수를 넘김
};

// 비디오 페이지 watch.pug
export const watch = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" }); // video를 찾지 못하면 404.pug를 보여줌
  }
  return res.render("watch", { pageTitle: video.title, video: video }); // video를 찾으면 watch.pug를 보여줌
};

// 비디오 수정 페이지 edit.pug
export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" }); // video를 찾지 못하면 404.pug를 보여줌
  }
  return res.render("edit", {
    pageTitle: `Editing: ${video.title}`,
    video: video,
  });
};

// 비디오 수정 post
export const postEdit = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  const video = await Video.exists({ _id: id }); // filter는 아무거나 가능
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" }); // video를 찾지 못하면 404.pug를 보여줌
  }
  // findByIdAndUpdate : 업데이트를 위한 함수
  await Video.findByIdAndUpdate(id, {
    title: title,
    description: description,
    hashtags: Video.formatHashtags(hashtags),
  });
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
      /*
      hashtags: hashtags, // video 모델의 pre로 hashtags를 처리
      */
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

// 비디오 삭제
export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// 비디오 검색
export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"), // keyword를 포함한 값을 검색
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos: videos });
};
