const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment.js');

// 댓글 목록 조회 API
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId: postId }).sort({
    syncTime: -1,
  });

  res.json(comments);
});

// 댓글 작성 API
router.post('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { commentId, author, content } = req.body;
  const comment = await Comment.findOne({ commentId });

  if (comment) {
    return res.status(400).json({ message: '이미 존재하는 commentId입니다.' });
  }

  if (!content) {
    return res.status(400).json({ message: '내용을 입력해주세요.' });
  }

  const createdComment = await Comment.create({
    postId,
    commentId,
    author,
    content,
  });

  res.json({ comment: createdComment });
});

// 댓글 수정 API
router.put('/posts/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const comment = await Comment.findOne({
    postId: postId,
    commentId: commentId,
  });

  if (!comment) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  if (!content) {
    return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }

  await Comment.updateOne({ postId, commentId }, { $set: { content } });

  res.json({ success: true });
});

// 댓글 삭제 API
router.delete('/posts/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;

  const comment = await Comment.findOne({
    postId: postId,
    commentId: commentId,
  });
  if (!comment) {
    return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
  }

  await Comment.deleteOne({ commentId });

  res.json({ success: true });
});

module.exports = router;
