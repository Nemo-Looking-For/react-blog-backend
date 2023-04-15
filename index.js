import express from "express";
import multer from "multer";
import cors from 'cors';

import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import { handleValidateonErrors, checkAuth } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";



mongoose
  .connect(
    "mongodb+srv://nnemshilov11:Mashan1106@cluster0.vzuxtsu.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Welcome to the club buddy (-__^__-)/");
});

app.post("/auth/login", loginValidation, handleValidateonErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidateonErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidateonErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, handleValidateonErrors, PostController.update);

app.listen(4400, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server Ok");
});
