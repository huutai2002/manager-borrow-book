const express = require("express");
const publisher = require("../controllers/publisher.controller");
const verifyToken = require("../middlewares/verify.token");
const isAdmin = require("../middlewares/authorization");

const router = express.Router();

router
  .route("/")
  .get(publisher.findAll)
  .post(verifyToken, isAdmin, publisher.create)
  .delete(verifyToken, isAdmin, publisher.deleteAll);

router
  .route("/:id")
  .get(publisher.findOne)
  .put(verifyToken, isAdmin, publisher.update)
  .delete(verifyToken, isAdmin, publisher.delete);

module.exports = router;
