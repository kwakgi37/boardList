import { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BoardList from 'BoardList';
import Write from 'Write';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoardDetail from 'BoardDetail';

/**
 * App class
 */
class App extends Component {
  state = {
    isModifyMode: false,
    isComplete: true,
    boardId: 0,
  };

  /**
   * @param {any} checkList
   */
  handleModify = (checkList: any) => {
    if (checkList.length === 0) {
      alert('수정할 게시글을 선택하세요.');
    } else if (checkList.length > 1) {
      alert('하나의 게시글만 선택하세요.');
    }

    this.setState({
      isModifyMode: checkList.length === 1,
    });

    this.setState({
      boardId: checkList[0] || 0,
    });
  };

  handleCancel = () => {
    this.setState({
      isModifyMode: false,
      isComplete: false,
      boardId: 0,
    });
  };

  renderComplete = () => {
    this.setState({
      isComplete: true,
    });
  };

  /**
   * @return {Component} Component
   */
  render() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <BoardList
                    isComplete={this.state.isComplete}
                    handleModify={this.handleModify}
                    renderComplete={this.renderComplete}
                  ></BoardList>
                  <Write
                    isModifyMode={this.state.isModifyMode}
                    boardId={this.state.boardId}
                    handleCancel={this.handleCancel}
                  ></Write>
                </>
              }
            ></Route>
            <Route path="/detail/:boardId" element={<BoardDetail />}></Route>
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
