const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

const users = [];

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/users/:id", (req, res) => {
  res.send("user "+req.params.id+" get");
});

app.post("/users", (req, res) => {
  users.push(req.body);
  res.send("user add");
});

app.put("/users/:id", (req, res) => {
  res.send("user "+req.params.id+" edit");
});

app.delete("/users/:id", (req, res) => {
  res.send("user "+req.params.id+" delete");
}); 
