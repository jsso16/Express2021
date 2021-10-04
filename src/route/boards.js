import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";

const seq = new sequelize('express', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  // logging: false
});

const Board = seq.define("board", {
  title: {
    type: sequelize.STRING,
    allowNull: false
  },
  content: {
    type: sequelize.TEXT,
    allowNull: true
  }
});

const board_sync = async() => {
  try {
    await Board.sync({ force: true });
    for(let i=0; i<100; i++) {
      await Board.create({
        title: faker.lorem.sentence(1),
        content: faker.lorem.sentence(10)
      });
    }
  } catch(err) {
    console.log(err);
  }
};
// board_sync();

const boardRouter = Router();

let boards = [];

boardRouter.get("/", (req, res) => {
  const boards = await Board.findAll();
  res.send({
    count: boards.length,
    boards
  });
});

// 게시글 조회
boardRouter.get("/:id", (req, res) => {
  const findBoard = _.find(boards, { id: parseInt(req.params.id) });
  let msg;

  if(findBoard) {
    msg = "정상적으로 조회되었습니다.";
    res.status(200).send({
      msg,
      findBoard
    });
  } else {
    msg = "해당 아이디를 가진 게시글이 없습니다.";
    res.status(400).send({
      msg,
      findBoard
    });
  }
});

// 게시글 생성
boardRouter.post("/", (req, res) => {
  const createBoard = req.body;
  const check_board = _.find(boards, [ "id", createBoard.id ]);
  let result;

  if(!check_board && createBoard.id && createBoard.title && createBoard.content && createBoard.createDate && createBoard.updateDate) {
    boards.push(createBoard);
    result = `${createBoard.id}번째 게시글을 생성했습니다.`;
  } else {
    result = '입력 요청값이 잘못되었습니다.';
  }
  res.status(201).send({
    result
  });
});

// 게시글 변경
boardRouter.put("/:id", (req, res) => {
  const find_board_idx = _.findIndex(boards, [ "id", parseInt(req.params.id) ]);
  let result;

  if(find_board_idx !== -1) {
    boards[find_board_idx].title = req.body.title;
    // boards[find_board_idx].content = req.body.content;
    result = "성공적으로 수정되었습니다.";
    res.status(200).send({
      result
    });
  } else {
    result = `아이디가 ${req.params.id}인 게시글이 존재하지 않습니다.`;
    res.status(400).send({
      result
    });
  }
});

// 게시글 지우기
boardRouter.delete("/:id", (req, res) => {
  const check_board = _.find(boards, [ "id", parseInt(req.params.id) ]);
  let result;

  if(check_board) {
    boards = _.reject(boards, ["id", parseInt(req.params.id)]);
    result = "성공적으로 삭제되었습니다.";
    res.status(200).send({
      result
    });
  } else {
    result = `아이디가 ${req.params.id}인 게시글이 존재하지 않습니다.`;
    res.status(400).send({
      result
    });
  }
});

export default boardRouter;
