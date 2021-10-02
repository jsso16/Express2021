import express from "express";
import sequelize from "sequelize";
import userRouter from "./route/users.js";
import boardRouter from "./route/boards.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/boards", boardRouter);

app.listen(3000);
