const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();
const usersRouter = require("./app/routes/user.route");
const publishersRouter = require("./app/routes/publisher.route");
const booksRouter = require("./app/routes/book.route");
const followsRouter = require("./app/routes/follow.route");

app.use(cors());
require("dotenv").config();
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/follows", followsRouter);
app.use("/api/publishers", publishersRouter);
app.use("/api/books", booksRouter);
app.use((req, res, next) => {
  //code khi không có route được định nghĩa nào khớp yêu cầu,
  // gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  //Middleware xử lý lỗi tập trung
  //gọi next(error) sẽ chuyển đến middleware xử lý lỗi này
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});
app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application" });
});

module.exports = app;
