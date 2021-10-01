import express from "express";
import userRouter from "./route/users.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);

app.listen(3000);
