const mongoose = require('mongoose');

const connect = async () => {
  try {
    return await mongoose.connect('mongodb://localhost:27017/Board');
  } catch (err) {
    return console.log(err);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
