const express = require('express');
const router = express.Router();
const Post = require('../schemas/post.js');

// 게시글 전체 조회 API
router.get('/posts', async (req, res) => {
  // const cursor = await Post.find();
  const posts = await Post.find(
    {},
    {
      _id: true,
      postId: true,
      title: true,
      author: true,
      content: true,
      syncTime: true,
    }
  ).sort({ syncTime: -1 });
  // console.log(posts);
  // .select('postId title author content syncTime');
  // find(query, projection)는 인자가 없으면 모든 도큐먼트를 조회, 리턴값은 cursor 객체.
  // query는 조회 기준, projection은 조회한 도큐먼트를 표시할 필드.
  // const posts = cursor.sort({ syncTime: -1 });
  // cursor.sort(DOCUMENT) DOCUMENT는 {KEY: VALUE} 구조로 키는 기준이 되는 필드, 밸류는 오름차순인지 내림차순인지.

  res.json(posts);
});
// 게시글 조회 API
router.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  // console.log(postId);
  const post = await Post.findOne(
    { postId },
    {
      _id: true,
      postId: true,
      title: true,
      author: true,
      content: true,
      syncTime: true,
    }
  );
  // console.log(post);

  // const test = await Post.find({ postId });
  // console.log(test);
  //find()는 배열안에 객체형태, findOne() 은 객체 형태
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  res.json(post);
});
// 게시글 작성 API
router.post('/posts/', async (req, res) => {
  const { postId, title, author, password, content } = req.body;

  // const post = new Post({ postId, title, author, password, content });

  const post = await Post.findOne({ postId });

  if (post) {
    return res.status(400).json({ message: '이미 존재하는 postId입니다.' });
  }

  // await post.save();

  const createdPost = await Post.create({
    postId,
    title,
    author,
    password,
    content,
  });
  res.json({ post: createdPost });
});

// 게시글 수정 API
router.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, password, content } = req.body;

  const post = await Post.findOne({ postId });
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  if (password !== post.password) {
    return res.status(401).json({ message: '비밀번호가 틀립니다.' });
  }

  // 비밀번호 변경은 생각안함
  // 타이틀, 컨텐츠 중 변경한것만 변경하도록, 둘다면 둘다 변경.
  const update = {};

  if (title) {
    update.title = title;
  }
  if (content) {
    update.content = content;
  }

  await Post.updateOne({ postId: Number(postId) }, { $set: update });

  res.json({ success: true });
});
// 게시글 삭제 API
router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  const post = await Post.findOne({ postId });
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  if (password !== post.password) {
    return res.status(401).json({ message: '비밀번호가 틀립니다.' });
  }

  await Post.deleteOne({ postId });

  res.json({ success: true });
});

module.exports = router;
