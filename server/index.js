const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const PORT = process.env.port || 8000;
const bodyParser = require('body-parser');

let corsOptions = {
  origin: 'http://localhost:3000', // 출처 허용 옵션 - 전체허용은 *
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '910544lokas!@',
  database: 'bbs',
});

app.get('/list', (req, res) => {
  const sqlQuery =
    "SELECT BOARD_ID, BOARD_TITLE, REGISTER_ID, DATE_FORMAT(REGISTER_DATE, '%Y-%m-%d') AS REGISTER_DATE FROM BOARD;";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.post('/detail', (req, res) => {
  const id = req.body.id;

  const sqlQuery =
    'SELECT BOARD_ID, BOARD_TITLE, BOARD_CONTENT FROM BOARD WHERE BOARD_ID = ?;';
  db.query(sqlQuery, [id], (err, result) => {
    res.send(result);
  });
});

app.get('/detail/:boardId', (req, res) => {
  const boardId = req.params.boardId; // 변수를 먼저 선언 및 할당

  console.log(boardId);

  const sqlQuery = `SELECT BOARD_ID, BOARD_TITLE, BOARD_CONTENT, REGISTER_ID, DATE_FORMAT(REGISTER_DATE, "%Y-%m-%d") AS REGISTER_DATE FROM BOARD WHERE BOARD_ID = ?;`;
  db.query(sqlQuery, [boardId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length === 0) {
        res.status(404).send('Board not found');
      } else {
        res.send(result[0]);
      }
    }
  });
});

app.post('/insert', (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const content = req.body.content;

  const sqlQuery =
    'INSERT INTO BOARD (BOARD_TITLE, BOARD_CONTENT, REGISTER_ID) VALUES (?,?,?);';
  db.query(sqlQuery, [title, author, content], (err, result) => {
    res.send(result);
  });
});

app.post('/update', (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const author = req.body.author;
  const content = req.body.content;

  const sqlQuery =
    'UPDATE BOARD SET BOARD_TITLE = ?, BOARD_CONTENT = ?, UPDATER_ID = ? WHERE BOARD_ID = ?;';
  db.query(sqlQuery, [title, author, content, id], (err, result) => {
    res.send(result);
  });
});

app.post('/delete', (req, res) => {
  const id = req.body.boardIdList;

  const sqlQuery = `DELETE FROM BOARD WHERE BOARD_ID IN (${id})`;
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.post('/login', (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;

  const sqlQuery = `SELECT *FROM USER WHERE USER_ID = ? AND USER_PASSWORD = ?;`;
  db.query(sqlQuery, [id, pw], (err, result) => {
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
