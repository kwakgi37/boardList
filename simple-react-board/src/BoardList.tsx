import { Component } from 'react';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

type BoardListType = {
  BOARD_ID: number;
  BOARD_TITLE: string;
  REGISTER_ID: string;
  REGISTER_DATE: string;
};

interface IProps {
  isComplete: boolean;
  handleModify: any;
  renderComplete: any;
}

/**
 * BoardList class
 * @param {SS} e
 */
class BoardList extends Component<IProps> {
  /**
   * @param {SS} props
   */
  constructor(props: any) {
    super(props);
    this.state = {
      boardList: [],
      checkList: [],
    };
  }

  state = {
    boardList: [],
    checkList: [],
  };

  getList = () => {
    Axios.get('http://localhost:8000/list', {})
      .then((res) => {
        const { data } = res;
        this.setState({
          boardList: data,
        });
        this.props.renderComplete();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * @param {boolean} checked
   * @param {any} id
   */
  onCheckboxChange = (checked: boolean, id: any) => {
    const list: Array<string> = this.state.checkList.filter((v) => {
      return v !== id;
    });

    if (checked) {
      list.push(id);
    }

    this.setState({
      checkList: list,
    });
  };

  /**
   */
  componentDidMount() {
    this.getList();
  }

  /**
   */
  componentDidUpdate() {
    if (!this.props.isComplete) {
      this.getList();
    }
  }

  handleDelete = () => {
    if (this.state.checkList.length === 0) {
      alert('삭제할 게시글을 선택하세요.');
      return;
    }

    let boardIdList = '';

    this.state.checkList.forEach((v: any) => {
      boardIdList += `'${v}',`;
    });

    Axios.post('http://localhost:8000/delete', {
      boardIdList: boardIdList.substring(0, boardIdList.length - 1),
    })
      .then(() => {
        this.getList();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * @return {Component} Component
   */
  render() {
    const { boardList }: { boardList: BoardListType[] } = this.state;
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>선택</th>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((v: any) => {
              return (
                <tr key={v.BOARD_ID}>
                  <td>
                    <input
                      type="checkbox"
                      value={v.BOARD_ID}
                      onChange={(e) => {
                        this.onCheckboxChange(
                          e.currentTarget.checked,
                          e.currentTarget.value
                        );
                      }}
                    ></input>
                  </td>
                  <td>{v.BOARD_ID}</td>
                  <td>
                    <Link to={`/detail/${v.BOARD_ID}`}>{v.BOARD_TITLE}</Link>
                  </td>
                  <td>{v.REGISTER_ID}</td>
                  <td>{v.REGISTER_DATE}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button variant="info">글쓰기</Button>
        <Button
          variant="secondary"
          onClick={() => {
            this.props.handleModify(this.state.checkList);
          }}
        >
          수정하기
        </Button>
        <Button variant="danger" onClick={this.handleDelete}>
          삭제하기
        </Button>
      </div>
    );
  }
}

export default BoardList;
