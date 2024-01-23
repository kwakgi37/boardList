import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const BoardDetail: React.FC = () => {
  const [board, setBoard] = useState<any>(null);
  const { boardId } = useParams();

  useEffect(() => {
    console.log(boardId);

    Axios.get(`http://localhost:8000/detail/${boardId}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [boardId]);

  return (
    <div>
      {board ? (
        <div>
          <h2>{board.BOARD_TITLE}</h2>
          <p>작성자: {board.REGISTER_ID}</p>
          <p>작성일: {board.REGISTER_DATE}</p>
          <p>{board.BOARD_CONTENT}</p>
          <Link to="/">
            <Button>돌아가기</Button>
          </Link>
        </div>
      ) : (
        <p>게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default BoardDetail;
