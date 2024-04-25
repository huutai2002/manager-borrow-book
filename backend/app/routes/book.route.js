const express = require("express");
const book = require("../controllers/book.controller");
const verifyToken = require("../middlewares/verify.token");
const isAdmin = require("../middlewares/authorization");

const router = express.Router();

router
  .route("/")
  .post(verifyToken, isAdmin, book.create)
  .get(book.findAll)
  .delete(verifyToken, isAdmin, book.deleteAll);

router
  .route("/:id")
  .get(book.findOne)
  .put(verifyToken, isAdmin, book.update)
  .delete(verifyToken, isAdmin, book.delete);

module.exports = router;
