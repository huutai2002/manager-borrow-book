const express = require("express");
const follow = require("../controllers/follow.controller");
const verifyToken = require("../middlewares/verify.token");
const isAdmin = require("../middlewares/authorization");

const router = express.Router();

router
  .route("/")
  .post(verifyToken, follow.create)
  .get(verifyToken, isAdmin, follow.findAll)
  .delete(verifyToken, isAdmin, follow.deleteAll);

router
  .route("/:id")
  .get(verifyToken, follow.findOne)
  .put(verifyToken, follow.update)
  .delete(verifyToken, follow.delete);
router.route("/getByUser/:id").get(verifyToken, follow.findByUser);
module.exports = router;
