const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(12);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(user);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if(user){
    res.json('Found')
    const passwordCheck = bcrypt.compare(password, user.password)
    if(passwordCheck){
        res.json('Password ok')
    } else {
        res.status(422).json('Password not ok')
    }
  } else {
    res.json('Not found')
  }
});

app.listen(4000);
