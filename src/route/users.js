import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User, Board, Permission } = db;
const userRouter = Router();

/***
  * REST API
  * C.R.U.D
  * Create(POST), Read(GET), Update(PUT), Delete(DELETE)
  * users router -> 유저 생성, 조회, 수정, 삭제
***/
// path = "/" => http://localhost:3000/users/ (GET)
userRouter.get("/", async(req, res) => {
  try {
    let { name, age } = req.query;
    const { Op } = db.sequelize;
    const findUserQuery = {
      attributes: ['id', 'name', 'age'],
      include: [Permission]
    }
    let result;

    if(name && age) {
      findUserQuery['where'] = { name: { [Op.substring]: name }, age }
    } else if(name) {
      findUserQuery['where'] = { name: { [Op.substring]: name } }
    } else if(age) {
      findUserQuery['where'] = { age }
    }

    result = await User.findAll(findUserQuery);
    res.status(200).send({
      count: result.length,
      result
    })
  } catch(err) {
    console.log(err);
    res.status(500).send({
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
    })
  }
});

// 유저 조회
// path = "/:id" => http://localhost:3000/users/:id (GET)
// http://localhost:3000/users/1 <- userId 값
userRouter.get("/:id", async(req, res) => {
  try {
    const findUser = await User.findOne({
      // include: [Permission, Board]
      // 모든 컬럼을 조회할 경우
      include: [{
        model: Permission, 
        attributes: ['id', 'title', 'level']
      },{
        model: Board, 
        attributes: ['id', 'title']
      }], // 컬럼을 필터해주거나 조건을 주고싶을 때 사용
      where: {
        id: req.params.id
      }
    });
    let msg;

    if(findUser) {
      msg = "정상적으로 조회되었습니다.";
      res.status(200).send({
        msg,
        findUser
      });
    } else {
      msg = "해당 아이디를 가진 유저가 없습니다.";
      res.status(400).send({
        msg,
        findUser
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send({
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
    })
  }
});

// 유저 생성
// http://localhost:3000/users/ (POST)
userRouter.post("/", async(req, res) => {
  try {
    // get과 다르게 req.query가 아닌 req.body에서 값을 가지고 옴
    const { name, age, password, permission } = req.body;
    
    if (!name || !age || !password || !permission) {
      res.status(400).send({
        msg: "입력 요청 값이 잘못되었습니다."
      });
    } else {
      const hashpwd = await bcrypt.hash(password, 4); // password hash 처리
      //const result = await User.create({name: name, age: age});
      const result = await User.create({ name, age, password: hashpwd });

      await result.createPermission({
        title: permission.title, 
        level: permission.level 
      });

      res.status(201).send({
        msg: `id ${result.id}, ${result.name} 유저가 생성되었습니다.`
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send({
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요"
    });
  }
});

// name 변경
// http://localhost:3000/users/:id (PUT)
userRouter.put("/:id", async(req, res) => {
  try {
    const { name, age } = req.body;
    let user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!user || (!name && !age)) {
      res.status(400).send({ 
        msg: '유저가 존재하지 않거나 입력값이 잘못되었습니다.' 
      });
    }
    if(name) user.name = name;
    if(age) user.age = age;

    await user.save();
    res.status(200).send({
      msg: '유저 정보가 정상적으로 수정되었습니다.'
    });
  } catch(error) {
    console.log(err);
    res.status(500).send({
      msg: '서버에 문제가 발했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

// user 지우기
// http://localhost:3000/users/:id (DELETE)
userRouter.delete("/:id", async(req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.params.id
      }
    })
    if(!user) {
      res.status(400).send({ 
        msg: '유저가 존재하지 않습니다.' 
      });
    }

    await user.destroy();
    res.status(200).send({
      msg: '유저 정보가 정상적으로 삭제되었습니다.'
    });
  } catch(error) {
    console.log(err);
    res.status(500).send({
      msg: '서버에 문제가 발했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

userRouter.get("/test/:id", async(req, res) => {
  try {
    const Op = db.sequelize.Op;
    const userResult = await User.findAll({
      attributes: ['id', 'name', 'age', 'updatedAt'],
      where: {
        [Op.or]: [{
          [Op.and]: {
            name: { [Op.startsWith]: "하" },
            age: { [Op.between]: [25,30] }
          }
        }, {
          [Op.and]: {
            name: { [Op.startsWith]: "이" },
            age: { [Op.between]: [30, 37] }
          }
        }]
      },
      order: [['age', 'DESC'], ['name', 'ASC']]
    });

    const boardResult = await Board.findAll({
      attributes: ['id', 'title', 'content'],
      // limit: 100
    });

    const user = await User.findOne({
      where: { id: req.params.id }
    });

    const board = await Board.findOne({
      where: { id: req.params.id }
    });

    if(!user || !board) {
      res.status(400).send({ 
        msg: '해당 정보가 존재하지 않습니다.' 
      });
    }

    await user.destroy();
    board.title += "test 타이틀 입니다.";
    await board.save();

    res.status(200).send({
      board,
      users: {
        count: userResult.length,
        data: userResult
      },
      boards: {
        count: boardResult.length,
        data: boardResult
      }
    });
  } catch(err) {
    console.log(err);
    res.status(500).send({ 
      msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요." 
    })
  }
});

export default userRouter;
