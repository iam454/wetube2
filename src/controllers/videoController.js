let videos = [
  {
    title: "First",
    rating: 3,
    comments: 5,
    createdAt: "3 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second",
    rating: 3,
    comments: 5,
    createdAt: "3 minutes ago",
    views: 155,
    id: 2,
  },
  {
    title: "Third",
    rating: 3,
    comments: 5,
    createdAt: "3 minutes ago",
    views: 155,
    id: 3,
  },
];

// 메인 홈페이지 home.pug
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos: videos }); // home.pug를 찾아서 렌더링하고, pageTitle이라는 변수를 넘김
};

// 비디오 페이지 watch.pug
export const watch = (req, res) => {
  const id = req.params.id;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: video.title, video: video });
};

// 비디오 수정 페이지 edit.pug
export const getEdit = (req, res) => {
  const id = req.params.id;
  const video = videos[id - 1];
  return res.render("edit", {
    pageTitle: `Editing: ${video.title}`,
    video: video,
  });
};

// 비디오 수정 post
export const postEdit = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

// 비디오 업로드 upload.pug
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

// 비디오 업로드 post
export const postUpload = (req, res) => {
  const newVideo = {
    title: req.body.title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
