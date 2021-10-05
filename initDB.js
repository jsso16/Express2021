import bcrypt from "bcrypt";
import faker from "faker";
import db from './src/models/index.js';

faker.locale = "ko";

const { User, Board } = db;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const user_sync = async() => {
  try {
    await User.sync({ force: true });
    for(let i=0; i<100; i++) {
      const hashpwd = await bcrypt.hash("test1234", 10);
      User.create({
        name: faker.name.lastName() + faker.name.firstName(),
        age: getRandomInt(15,50),
        password: hashpwd
      });
    }
  } catch(err) {
    console.log(err);
  }
};

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

user_sync();
board_sync();
