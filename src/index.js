import express from "express";
import _ from "lodash";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

let users = [{
  id: 1,
  name: "홍길동",
  age: 21
},{
  id: 2,
  name: "이길동",
  age: 25
},{
  id: 3,
  name: "김길동",
  age: 22
},{
  id: 4,
  name: "박길동",
  age: 31
},{
  id: 5,
  name: "고길동",
  age: 29
}];

let user;

app.get("/users", (req, res) => {
  res.send({
    count: users.length,
    users
  });
});

app.get("/users/:id", (req, res) => {
  const findUser = _.find(users, { id: parseInt(req.params.id) });
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
});

// 유저 생성
app.post("/users", (req, res) => {
  const createUser = req.body;
  const check_user = _.find(users, [ "id", createUser.id ]);
  let result;

  if(!check_user && createUser.id && createUser.name && createUser.age) {
    users.push(createUser);
    result = `${createUser.name}님을 생성했습니다.`;
  } else {
    result = '입력 요청값이 잘못되었습니다.';
  }
  res.status(201).send({
    result
  });
});

// name 변경
app.put("/users/:id", (req, res) => {
  // user 안에서 현재 요청이 들어온 :id 값이 같은 것이 있는지 확인하고, 있으면 값을 리턴, 없으면 -1을 리턴
  const find_user_idx = _.findIndex(users, [ "id", parseInt(req.params.id) ]);
  let result;

  // find_user_idx가 -1이 아니라면, users 안에 :id와 동일한 ID를 가진 객체가 존재
  if(find_user_idx !== -1) {
    users[find_user_idx].name = req.body.name;
    result = "성공적으로 수정 되었습니다.";
    res.status(200).send({
      result
    });
  } else {
    result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
    res.status(400).send({
      result
    });
  }
});

// user 지우기
app.delete("/users/:id", (req, res) => {
  // lodash의 find 메서드를 이용해서 요청이 들어온 :id 값을 가진 users 안의 객체가 있는지 체크
  const check_user = _.find(users, [ "id", parseInt(req.params.id) ]);
  let result;

  // 같은 아이디 값을 가진 것이 있다면?
  if(check_user) {
    // lodash의 reject 메서드를 이용해 해당 id를 가진 객체를 삭제
    users = _.reject(users, ["id", parseInt(req.params.id)]);
    result = "성공적으로 삭제 되었습니다.";
    res.status(200).send({
      result
    });
  } else {
    result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
    res.status(400).send({
      result
    });
  }
});
