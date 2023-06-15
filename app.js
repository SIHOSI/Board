const express = require('express');
const app = express();

const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');

const connect = require('./schemas');
connect();

app.use(express.json());
app.use('/api', [postRouter, commentRouter]);

app.get('/', (req, res) => {
  res.send('Hello Wolrd!');
});

app.listen(3000, () => {
  console.log('3000포트로 서버가 열림.');
});
