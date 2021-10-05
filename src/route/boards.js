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

boardRouter.get("/", async(req, res) => {
  try {
    const boards = await Board.findAll();
    res.send({
      count: boards.length,
      boards
  });
  } catch(err) {
    console.log(err);
    res.status(500).send({
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
    })
  }
});

// 게시글 조회
boardRouter.get("/:id", async(req, res) => {
  try {
    const findBoard = await Board.findOne({
      where: {
        id: req.params.id
      }
    })
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
  } catch(err) {
    console.log(err);
    res.status(500).send({
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
    })
  }
});

// 게시글 생성
boardRouter.post("/", async(req, res) => {
  try {
    const { title, content } = req.body;
    
    if(!title) {
      res.status(400).send({
        msg: "입력 요청 값이 잘못되었습니다."
      });
    }

    const result = await Board.create({ 
      title: title ? title : null, 
      content: content ? content : null
    });

    res.status(201).send({
      msg: `id ${result.id}, ${result.title} 게시글이 생성되었습니다.`
    });
  } catch(err) {
    console.log(err);
    res.status(500).send({
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
    });
  }
});

// 게시글 변경
boardRouter.put("/:id", async(req, res) => {
  try {
    const { title , content } = req.body;
    let board = await Board.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!board || (!title && !content)) {
      res.status(400).send({ 
        msg: '게시글이 존재하지 않거나 입력값이 잘못되었습니다.' 
      });
    }
    if(title) board.title = title;
    if(content) board.content = content;

    await board.save();
    res.status(200).send({
      msg: '게시글이 정상적으로 수정되었습니다.'
    });
  } catch(error) {
    console.log(err);
    res.status(500).send({
      msg: '서버에 문제가 발했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

// 게시글 지우기
boardRouter.delete("/:id", async(req, res) => {
  try {
    let board = await Board.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!board) {
      res.status(400).send({ 
        msg: '게시글이 존재하지 않습니다.' 
      });
    }

    await board.destroy();
    res.status(200).send({
      msg: '게시글이 정상적으로 삭제되었습니다.'
    });
  } catch(error) {
    console.log(err);
    res.status(500).send({
      msg: '서버에 문제가 발했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

export default boardRouter;
